import { PushNotificationMessageDTO } from '../dto';
import { PushNotificationAdapter } from './push-notification.adapter';
import * as firebase from 'firebase-admin';
export interface PNFirebaseAdapterConfig {
    init?: boolean;
    serviceAccount?: string | firebase.ServiceAccount;
}
export declare class PNFirebaseAdapter extends PushNotificationAdapter {
    app: firebase.app.App;
    constructor({ init, serviceAccount }: PNFirebaseAdapterConfig);
    send(message: PushNotificationMessageDTO): Promise<any>;
}
//# sourceMappingURL=pn-firebase.adapter.d.ts.map