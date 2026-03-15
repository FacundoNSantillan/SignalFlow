import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ProviderFactory } from '../../infrastructure/providers/provider.factory';
import { PrismaService } from '../../infrastructure/database/prisma.service';

@Processor('notifications')
@Injectable()
export class WorkerService extends WorkerHost {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    private readonly providerFactory: ProviderFactory,
    private readonly prisma: PrismaService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { type, recipient, subject, body } = job.data;
    
    const notificationRecord = await this.prisma.notification.create({
      data: {
        type,
        recipient,
        subject,
        body,
        jobId: job.id,
        status: 'PENDING',
      },
    });

    try {
      const provider = this.providerFactory.getProvider(type);
      const result = await provider.send(recipient, subject, body);

      await this.prisma.notification.update({
        where: { id: notificationRecord.id },
        data: { status: 'COMPLETED' },
      });

      this.logger.log(`Job ${job.id} guardado en DB como COMPLETED`);
      return result;

    } catch (error) {
      await this.prisma.notification.update({
        where: { id: notificationRecord.id },
        data: { 
          status: 'FAILED',
          error: error.message 
        },
      });

      this.logger.error(`Job ${job.id} marcado como FAILED en DB`);
      throw error;
    }
  }
}