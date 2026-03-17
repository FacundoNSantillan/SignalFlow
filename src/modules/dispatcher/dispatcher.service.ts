import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendNotificationDto } from '../../common/dto/send-notification.dto';

@Injectable()
export class DispatcherService {
  private readonly logger = new Logger(DispatcherService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
  ) {}

async dispatchNotification(data: SendNotificationDto) {
    this.logger.log(`Encolando notificación para: ${data.recipient}`);

    const job = await this.notificationQueue.add('send-notification', data, {
      attempts: 5, 
      backoff: {
        type: 'exponential',
        delay: 3000, 
      },
      priority: data.type === 'EMAIL' ? 1 : 2, 
      removeOnComplete: {
        age: 3600, 
        count: 1000,
      },
      removeOnFail: {
        age: 24 * 3600,
      }
    });

    return {
      success: true,
      jobId: job.id,
      message: 'Notification queued successfully',
    };
  }
}