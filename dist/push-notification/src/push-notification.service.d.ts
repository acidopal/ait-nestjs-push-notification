import { PushNotificationConfig } from './interfaces';
import { PushNotificationMessageDTO } from './dto';
import { PushNotificationAdapter } from './adapters';
export declare class PushNotificationService {
    private readonly config;
    constructor(config: PushNotificationConfig);
    getAdapter<T extends PushNotificationAdapter = PushNotificationAdapter>(provider?: string): T;
    send(message: PushNotificationMessageDTO, provider?: string): Promise<any>;
    invalidProvider(): void;
}
//# sourceMappingURL=push-notification.service.d.ts.map