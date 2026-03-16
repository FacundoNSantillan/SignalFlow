import { Injectable } from '@nestjs/common';
import { INotificationProvider } from '../../core/interfaces/notification-provider.interface'; 
import { ResendProvider } from './resend.provider';

@Injectable()
export class ProviderFactory {
  constructor(
    private readonly resendProvider: ResendProvider
  ) {}

  getProvider(type: string): INotificationProvider {
    switch (type.toLowerCase()) {
      case 'email':
        return this.resendProvider;
      default:
        throw new Error(`Provider for ${type} not found`);
    }
  }
}