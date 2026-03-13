import { Body, Controller, Post } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { SendNotificationDto } from '../../common/dto/send-notification.dto';

@Controller('notifications')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Post('send')
  async send(@Body() notificationDto: SendNotificationDto) {
    return await this.dispatcherService.dispatchNotification(notificationDto);
  }
}