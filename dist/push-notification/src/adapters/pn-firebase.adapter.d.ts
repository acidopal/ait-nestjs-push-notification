import { PushNotificationMessageDTO } from '../dto';
import { PushNotificationAdapter } from './push-notification.adapter';
import * as firebase from 'firebase-admin';
export interface PNFirebaseAdapterConfig {
    init?: boolean;
    serviceAccount?: string | firebase.ServiceAccount;
    name?: string;
    destroyOnClose?: boolean;
}
/**
 * Adapter for Firebase Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain device ids
 * - PushNotificationMessageTopicsDTO -> send message to certain FCM topics
 */
export declare class PNFirebaseAdapter extends PushNotificationAdapter {
    app: firebase.app.App;
    private name;
    private init;
    private destroyOnClose;
    constructor({ init, serviceAccount, name, destroyOnClose, }: PNFirebaseAdapterConfig);
    send(message: PushNotificationMessageDTO): Promise<any>;
    close(): void;
}
//# sourceMappingURL=pn-firebase.adapter.d.ts.map