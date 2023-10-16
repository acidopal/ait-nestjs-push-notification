import { PushNotificationConfig } from './interfaces';
import { PushNotificationMessageDTO } from './dto';
import { PushNotificationAdapter } from './adapters';
export declare class PushNotificationService {
    private adapters;
    private defaultProvider;
    constructor(config: PushNotificationConfig);
    /**
     * add / replace PN adapter
     * name - adapter name
     * builder - function to create adapter if adapter should be created
     */
    putAdapter(provider: string, builder: () => PushNotificationAdapter, replace?: boolean): void;
    /** remove certain adapter from service */
    removeAdapter(provider: string): void;
    /** get adapter with provider name, if empty, use defaultProvider */
    getAdapter<T extends PushNotificationAdapter = PushNotificationAdapter>(provider?: string): T;
    /** send message using certain provider, or defaultProvider if not provided */
    send(message: PushNotificationMessageDTO, provider?: string): Promise<any>;
    /** throw provider error because no provider found */
    invalidProvider(): void;
}
//# sourceMappingURL=push-notification.service.d.ts.map