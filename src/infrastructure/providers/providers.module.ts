import { Module } from '@nestjs/common';
import { ResendProvider } from './resend.provider';
import { ProviderFactory } from './provider.factory';
import { MailTemplateService } from '../templates/mail-templates.service';

@Module({
  providers: [
    ResendProvider,
    ProviderFactory,
    MailTemplateService,
  ],
  exports: [ProviderFactory],
})
export class ProvidersModule {}