"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationMessageUserDTO = exports.PushNotificationMessageDevicesDTO = exports.PushNotificationMessageTopicsDTO = exports.PushNotificationMessageFilterDTO = exports.PushNotificationMessageDTO = void 0;
class PushNotificationMessageDTO {
    validate() {
        if (!this.body && !this.data)
            throw new Error('Push Notification body or data should not be empty');
    }
}
exports.PushNotificationMessageDTO = PushNotificationMessageDTO;
class PushNotificationMessageFilterDTO extends PushNotificationMessageDTO {
    constructor(params) {
        super();
        Object.assign(this, params);
    }
}
exports.PushNotificationMessageFilterDTO = PushNotificationMessageFilterDTO;
class PushNotificationMessageTopicsDTO extends PushNotificationMessageDTO {
    constructor(params) {
        super();
        Object.assign(this, params);
    }
}
exports.PushNotificationMessageTopicsDTO = PushNotificationMessageTopicsDTO;
class PushNotificationMessageDevicesDTO extends PushNotificationMessageDTO {
    constructor(params) {
        super();
        Object.assign(this, params);
    }
}
exports.PushNotificationMessageDevicesDTO = PushNotificationMessageDevicesDTO;
class PushNotificationMessageUserDTO extends PushNotificationMessageDTO {
    constructor(params) {
        super();
        Object.assign(this, params);
    }
}
exports.PushNotificationMessageUserDTO = PushNotificationMessageUserDTO;
//# sourceMappingURL=push-notification-message.dto.js.map