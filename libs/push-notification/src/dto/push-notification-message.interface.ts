export interface PushNotificationTargetFilter {
  field: string;
  key?: string;
  relation: string;
  value: string;
  operator?: 'AND' | 'OR';
}

export abstract class PushNotificationMessageDTO {
  /// payloads
  public title?: string;
  public body: string;
  public imageUrl?: string;
  public data?: Record<string, any>;
}

export class PushNotificationMessageFilterDTO extends PushNotificationMessageDTO {
  public filters: Array<PushNotificationTargetFilter>;
  constructor(
    params: {
      filters: Array<PushNotificationTargetFilter>;
    } & PushNotificationMessageDTO,
  ) {
    super();
    Object.assign(this, params);
  }
}

export class PushNotificationMessageTopicsDTO extends PushNotificationMessageDTO {
  public topics: string[];
  constructor(
    params: {
      topics: string[];
    } & PushNotificationMessageDTO,
  ) {
    super();
    Object.assign(this, params);
  }
}

export class PushNotificationMessageDevicesDTO extends PushNotificationMessageDTO {
  public device_ids: string[];
  constructor(
    params: {
      device_ids: string[];
    } & PushNotificationMessageDTO,
  ) {
    super();
    Object.assign(this, params);
  }
}
