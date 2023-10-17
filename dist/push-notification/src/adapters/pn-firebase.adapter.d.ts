import { PushNotificationMessageDTO } from '../dto';
import { PushNotificationAdapter } from './push-notification.adapter';
import * as firebase from 'firebase-admin';
export interface PNFirebaseAdapterConfig {
    /** should this adapter init firebase client, if not will use existing client */
    init?: boolean;
    /**
     * which service account data/path to use, if not will use one specified by environment
     * variable GOOGLE_APPLICATION_CREDENTIALS
     */
    serviceAccount?: string | firebase.ServiceAccount;
    /** Firebase instance name, will use default if not specified */
    name?: string;
    /** Should firebase instance get destroyed when this adapter is removed, default to true */
    destroyOnClose?: boolean;
    /**
     * userPrefix when sending to user ids, will use topic prefix, default to `external_id-`\
     * For example, it will be sent to user id 1, it will send to topic `external_id-1`
     */
    userPrefix?: string;
}
/**
 * Adapter for Firebase Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain device ids
 * - PushNotificationMessageUserDTO -> send message to certain FCM user id,
 * appending userPrefix with input user_id as 1 topic name, for example `external_id-1`
 * - PushNotificationMessageTopicsDTO -> send message to certain FCM topics
 */
export declare class PNFirebaseAdapter extends PushNotificationAdapter {
    app: firebase.app.App;
    private name;
    private init;
    private destroyOnClose;
    private userPrefix;
    constructor({ init, serviceAccount, name, destroyOnClose, userPrefix, }: PNFirebaseAdapterConfig);
    send(message: PushNotificationMessageDTO): Promise<any>;
    close(): void;
}
//# sourceMappingURL=pn-firebase.adapter.d.ts.map