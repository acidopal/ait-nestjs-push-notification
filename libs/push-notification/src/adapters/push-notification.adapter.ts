import { PushNotificationMessageDTO } from '../dto';

/**
 * Abstract class for push notification adapters\
 * for implementation, please use this name convention: PN*Adapter\
 * for example: `PNFirebaseAdapter`
 */
export abstract class PushNotificationAdapter {
  abstract send(message: PushNotificationMessageDTO): Promise<any>;
}
