import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { INotificationProvider } from '../../core/interfaces/notification-provider.interface';

@Injectable()
export class ResendProvider implements INotificationProvider {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendProvider.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async send(recipient: string, subject: string, body: string): Promise<any> {
    try {
      const data = await this.resend.emails.send({
        from: 'OmniSend <onboarding@resend.dev>', 
        to: [recipient],
        subject: subject || 'Nueva Notificación',
        html: `<strong>${body}</strong>`, 
      });

      this.logger.log(`Email enviado vía Resend a ${recipient}. ID: ${data.data?.id}`);
      return data;
    } catch (error) {
      this.logger.error(`Error en Resend: ${error.message}`);
      throw error;
    }
  }
}