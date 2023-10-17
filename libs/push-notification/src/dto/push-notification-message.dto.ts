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

export abstract class PushNotificationMessageDTO {
  /// payloads
  public title?: string;
  public body?: string;
  public imageUrl?: string;
  public data?: Record<string, any>;

  validate() {
    if (!this.body && !this.data)
      throw new Error('Push Notification body or data should not be empty');
  }
}

export class PushNotificationMessageFilterDTO extends PushNotificationMessageDTO {
  public filters: Array<PushNotificationTargetFilter>;
  constructor(
    params: {
      filters: Array<PushNotificationTargetFilter>;
    } & PushNotificationMessageParam,
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
    } & PushNotificationMessageParam,
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
    } & PushNotificationMessageParam,
  ) {
    super();
    Object.assign(this, params);
  }
}

export class PushNotificationMessageUserDTO extends PushNotificationMessageDTO {
  public user_ids: string[];
  constructor(
    params: {
      user_ids: string[];
    } & PushNotificationMessageParam,
  ) {
    super();
    Object.assign(this, params);
  }
}
