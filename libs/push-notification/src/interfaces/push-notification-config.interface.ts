import { PushNotificationAdapter } from '../adapters/push-notification.adapter';

export class PushNotificationConfig {
  defaultProvider: string;
  adapters: Record<string, PushNotificationAdapter>;
}
