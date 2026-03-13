import { Injectable } from '@nestjs/common';
import { EmailProvider } from './email.provider';
import { INotificationProvider } from '../../core/interfaces/notification-provider.interface';

@Injectable()
export class ProviderFactory {
  constructor(private readonly emailProvider: EmailProvider) {}

  getProvider(type: string): INotificationProvider {
    switch (type.toUpperCase()) {
      case 'EMAIL':
        return this.emailProvider;
      default:
        throw new Error(`Provider for type ${type} not implemented`);
    }
  }
}