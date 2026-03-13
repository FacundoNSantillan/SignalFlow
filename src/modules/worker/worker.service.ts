import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ProviderFactory } from '../../infrastructure/providers/provider.factory';

@Processor('notifications')
@Injectable()
export class WorkerService extends WorkerHost {
  private readonly logger = new Logger(WorkerService.name);

  constructor(private readonly providerFactory: ProviderFactory) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { type, recipient, subject, body } = job.data;
    
    this.logger.log(`Procesando Job ${job.id} de tipo ${type}`);

    try {
      const provider = this.providerFactory.getProvider(type);

      const result = await provider.send(recipient, subject, body);

      if (result.success) {
        this.logger.log(`Notificacion ${job.id} enviada. ID: ${result.messageId}`);
        return result;
      } else {
        throw new Error(result.error || 'Error desconocido en el proveedor');
      }
    } catch (error) {
      this.logger.error(`Fallo el Job ${job.id}: ${error.message}`);
      throw error;
    }
  }
}