"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationMessageDevicesDTO = exports.PushNotificationMessageTopicsDTO = exports.PushNotificationMessageFilterDTO = exports.PushNotificationMessageDTO = void 0;
class PushNotificationMessageDTO {
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
//# sourceMappingURL=push-notification-message.interface.js.map