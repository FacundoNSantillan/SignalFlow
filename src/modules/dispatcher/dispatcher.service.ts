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

    const job = await this.notificationQueue.add('send-task', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
    });

    return {
      success: true,
      jobId: job.id,
      message: 'Notification queued successfully',
    };
  }
}