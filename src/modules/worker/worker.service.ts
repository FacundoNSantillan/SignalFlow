import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('notifications') 
@Injectable()
export class WorkerService extends WorkerHost {
  private readonly logger = new Logger(WorkerService.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Procesando Job ID: ${job.id}`);
    
    const { type, recipient, subject, body } = job.data;

    this.logger.log(`Enviando ${type} a ${recipient}...`);
    this.logger.debug(`Contenido: ${body}`);

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.logger.log(`Notificación ${job.id} enviada con éxito.`);
    
    return { sent: true };
  }
}