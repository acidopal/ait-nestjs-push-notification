export interface PushNotificationTargetFilter {
    field: string;
    key?: string;
    relation: string;
    value: string;
    operator?: 'AND' | 'OR';
}
export declare abstract class PushNotificationMessageDTO {
    title?: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, any>;
}
export declare class PushNotificationMessageFilterDTO extends PushNotificationMessageDTO {
    filters: Array<PushNotificationTargetFilter>;
    constructor(params: {
        filters: Array<PushNotificationTargetFilter>;
    } & PushNotificationMessageDTO);
}
export declare class PushNotificationMessageTopicsDTO extends PushNotificationMessageDTO {
    topics: string[];
    constructor(params: {
        topics: string[];
    } & PushNotificationMessageDTO);
}
export declare class PushNotificationMessageDevicesDTO extends PushNotificationMessageDTO {
    device_ids: string[];
    constructor(params: {
        device_ids: string[];
    } & PushNotificationMessageDTO);
}
//# sourceMappingURL=push-notification-message.interface.d.ts.map