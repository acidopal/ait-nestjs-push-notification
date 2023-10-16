import { PushNotificationMessageDTO } from '../dto';

/**
 * Abstract class for push notification adapters\
 * for implementation, please use this name convention: PN*Adapter\
 * for example: `PNFirebaseAdapter`
 */
export abstract class PushNotificationAdapter {
  /** send message from adapter */
  abstract send(message: PushNotificationMessageDTO): Promise<any>;
  /** close adapter, may destroy any client/other running instances */
  abstract close(): any;
}
