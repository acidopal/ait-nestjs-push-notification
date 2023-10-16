import { PushNotificationMessageDTO } from '../dto';
/**
 * Abstract class for push notification adapters\
 * for implementation, please use this name convention: PN*Adapter\
 * for example: `PNFirebaseAdapter`
 */
export declare abstract class PushNotificationAdapter {
    abstract send(message: PushNotificationMessageDTO): Promise<any>;
}
//# sourceMappingURL=push-notification.adapter.d.ts.map