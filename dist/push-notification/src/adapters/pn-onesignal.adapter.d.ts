import { ConfigurationParameters } from '@onesignal/node-onesignal/dist/configuration';
import { PushNotificationMessageDTO } from '../dto';
import { PushNotificationAdapter } from './push-notification.adapter';
import * as OneSignal from '@onesignal/node-onesignal';
export interface PNOneSignalAdapterConfig extends ConfigurationParameters {
    appId: string;
}
/**
 * Adapter for OneSignal Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain player_ids/subscription_ids
 * - PushNotificationMessageUserDTO -> send message to certain user id using OneSignal external_id
 * - PushNotificationMessageTopicsDTO -> send message to certain filter tags with relation `exists`
 * - PushNotificationMessageFilterDTO -> send message to certain filter tags
 */
export declare class PNOneSignalAdapter extends PushNotificationAdapter {
    app: OneSignal.DefaultApi;
    appId: string;
    constructor({ appId, ...configParam }: PNOneSignalAdapterConfig);
    constructBaseMessage(message: PushNotificationMessageDTO): OneSignal.Notification;
    send(message: PushNotificationMessageDTO): Promise<any>;
    close(): void;
}
//# sourceMappingURL=pn-onesignal.adapter.d.ts.map