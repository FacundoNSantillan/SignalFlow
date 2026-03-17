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
    
    this.logger.log(`Procesando intento #${job.attemptsMade + 1} para el Job ${job.id}`);

    let notificationRecord = await this.prisma.notification.findFirst({
      where: { jobId: job.id }
    });

    if (!notificationRecord) {
      notificationRecord = await this.prisma.notification.create({
        data: {
          type,
          recipient,
          subject,
          body: typeof body === 'string' ? body : JSON.stringify(body),
          jobId: job.id,
          status: 'PENDING',
        },
      });
    }

    try {
      const provider = this.providerFactory.getProvider(type);
      const result = await provider.send(recipient, subject, body);

      await this.prisma.notification.update({
        where: { id: notificationRecord.id },
        data: { status: 'COMPLETED', error: null }, 
      });

      this.logger.log(`Job ${job.id} finalizado con éxito`);
      return result;

    } catch (error) {
      await this.prisma.notification.update({
        where: { id: notificationRecord.id },
        data: { 
          status: 'FAILED',
          error: `Intento ${job.attemptsMade + 1}: ${error.message}` 
        },
      });

      this.logger.error(`Intento fallido para Job ${job.id}: ${error.message}`);
      throw error; 
    }
  }
}