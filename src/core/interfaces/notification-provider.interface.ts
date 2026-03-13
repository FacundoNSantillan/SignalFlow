export interface NotificationResponse {
  success: boolean;
  messageId: string;
  error?: string;
}

export interface INotificationProvider {
  send(recipient: string, subject: string, body: string, payload?: any): Promise<NotificationResponse>;
}