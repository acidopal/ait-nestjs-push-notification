export interface PushNotificationTargetFilter {
    field: string;
    key?: string;
    relation: string;
    value: string;
    operator?: 'AND' | 'OR';
}
interface PushNotificationMessageParam {
    title?: string;
    body?: string;
    imageUrl?: string;
    data?: Record<string, any>;
}
export declare abstract class PushNotificationMessageDTO {
    title?: string;
    body?: string;
    imageUrl?: string;
    data?: Record<string, any>;
    validate(): void;
}
export declare class PushNotificationMessageFilterDTO extends PushNotificationMessageDTO {
    filters: Array<PushNotificationTargetFilter>;
    constructor(params: {
        filters: Array<PushNotificationTargetFilter>;
    } & PushNotificationMessageParam);
}
export declare class PushNotificationMessageTopicsDTO extends PushNotificationMessageDTO {
    topics: string[];
    constructor(params: {
        topics: string[];
    } & PushNotificationMessageParam);
}
export declare class PushNotificationMessageDevicesDTO extends PushNotificationMessageDTO {
    device_ids: string[];
    constructor(params: {
        device_ids: string[];
    } & PushNotificationMessageParam);
}
export {};
//# sourceMappingURL=push-notification-message.dto.d.ts.map