import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { INotificationProvider } from '../../core/interfaces/notification-provider.interface';
import { MailTemplateService } from '../templates/mail-templates.service'; 

@Injectable()
export class ResendProvider implements INotificationProvider {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendProvider.name);

  constructor(private readonly templateService: MailTemplateService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

async send(recipient: string, subject: string, body: string | any): Promise<any> {
    let htmlContent = '';
    let data: any;

    try {
      data = typeof body === 'string' ? JSON.parse(body) : body;

      if (data && data.template) {
        this.logger.log(`🎨 Aplicando template: ${data.template}`);
        htmlContent = this.templateService.compile(data.template, data.context);
      } else {
        htmlContent = typeof body === 'string' ? body : JSON.stringify(body);
      }
    } catch (e) {
      this.logger.warn(`⚠️ Enviando como texto plano por error en procesamiento.`);
      htmlContent = typeof body === 'string' ? body : JSON.stringify(body);
    }

    return await this.resend.emails.send({
      from: 'OmniSend <onboarding@resend.dev>',
      to: [recipient],
      subject: subject,
      html: htmlContent,
    });
  }
}