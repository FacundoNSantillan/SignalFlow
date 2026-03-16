import { Module } from '@nestjs/common';
import { ResendProvider } from './resend.provider';
import { ProviderFactory } from './provider.factory';

@Module({
  providers: [
    ResendProvider,
    ProviderFactory
  ],
  exports: [ProviderFactory],
})
export class ProvidersModule {}