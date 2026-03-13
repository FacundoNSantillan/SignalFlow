import { Injectable, Logger } from '@nestjs/common';
import { INotificationProvider, ProviderResponse } from '../../core/interfaces/notification-provider.interface';

@Injectable()
export class EmailProvider implements INotificationProvider {
  private readonly logger = new Logger(EmailProvider.name);

  async send(recipient: string, subject: string, body: string): Promise<ProviderResponse> {
    this.logger.log(`[EmailProvider] Simulando envío de mail a ${recipient}...`);
    
    await new Promise(res => setTimeout(res, 500));

    return {
      success: true,
      messageId: `email-${Math.random().toString(36).substr(2, 9)}`
    };
  }
}