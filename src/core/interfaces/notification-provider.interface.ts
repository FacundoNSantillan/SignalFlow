export interface ProviderResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface INotificationProvider {
  send(recipient: string, subject: string, body: string): Promise<ProviderResponse>;
}