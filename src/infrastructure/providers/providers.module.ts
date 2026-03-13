import { Module } from '@nestjs/common';
import { EmailProvider } from './email.provider';
import { ProviderFactory } from './provider.factory';

@Module({
  providers: [EmailProvider, ProviderFactory],
  exports: [ProviderFactory],
})
export class ProvidersModule {}