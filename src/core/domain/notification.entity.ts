export class Notification {
  constructor(
    public readonly id: string,
    public readonly type: 'EMAIL' | 'SMS' | 'PUSH',
    public readonly recipient: string,
    public readonly subject: string,
    public readonly content: string,
    public readonly status: 'PENDING' | 'SENT' | 'FAILED',
    public readonly createdAt: Date,
  ) {}
}