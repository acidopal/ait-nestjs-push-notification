import { PushNotificationAdapter } from '../adapters/push-notification.adapter';

export class PushNotificationConfig {
  /** default provider name that will be used when sending PN */
  defaultProvider: string;
  /** map of provider name and its adapter to be used when sending push notification */
  adapters: Record<string, PushNotificationAdapter>;
}
