import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DispatcherService } from './dispatcher.service';
import { SendNotificationDto } from '../../common/dto/send-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Post('send')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ 
    summary: 'Encolar una nueva notificación',
    description: 'Recibe los datos de la notificación, los valida y los envía a la cola de procesamiento en Redis.' 
  })
  @ApiBody({ type: SendNotificationDto })
  @ApiResponse({ 
    status: 202, 
    description: 'La notificación ha sido recibida y encolada con éxito.',
    schema: {
      example: {
        success: true,
        jobId: '123',
        message: 'Notification queued successfully'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error de validación en los datos enviados.' 
  })
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return await this.dispatcherService.dispatchNotification(sendNotificationDto);
  }
}