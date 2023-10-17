"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNOneSignalAdapter = void 0;
const dto_1 = require("../dto");
const push_notification_adapter_1 = require("./push-notification.adapter");
const OneSignal = __importStar(require("@onesignal/node-onesignal"));
/**
 * Adapter for OneSignal Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain player_ids/subscription_ids
 * - PushNotificationMessageUserDTO -> send message to certain user id using OneSignal external_id
 * - PushNotificationMessageTopicsDTO -> send message to certain filter tags with relation `exists`
 * - PushNotificationMessageFilterDTO -> send message to certain filter tags
 */
class PNOneSignalAdapter extends push_notification_adapter_1.PushNotificationAdapter {
    constructor(_a) {
        var { appId } = _a, configParam = __rest(_a, ["appId"]);
        super();
        const configuration = OneSignal.createConfiguration(configParam);
        this.app = new OneSignal.DefaultApi(configuration);
        this.appId = appId;
    }
    constructBaseMessage(message) {
        const notification = new OneSignal.Notification();
        notification.app_id = this.appId;
        if (message.title) {
            notification.headings = {
                en: message.title,
            };
        }
        if (message.body) {
            notification.contents = {
                en: message.title,
            };
        }
        if (message.imageUrl) {
            notification.big_picture = message.imageUrl;
            notification.ios_attachments = { photo: message.imageUrl };
        }
        notification.data = message.data;
        return notification;
    }
    async send(message) {
        const queues = [];
        if (message instanceof dto_1.PushNotificationMessageDevicesDTO) {
            const chunkSize = 2000;
            for (let i = 0; i < message.device_ids.length; i += chunkSize) {
                const notification = this.constructBaseMessage(message);
                notification.include_player_ids = message.device_ids.slice(i, i + chunkSize);
                queues.push(this.app.createNotification(notification));
            }
            return await Promise.all(queues);
        }
        else if (message instanceof dto_1.PushNotificationMessageTopicsDTO) {
            for (let i = 0; i < message.topics.length; i++) {
                const notification = this.constructBaseMessage(message);
                notification.filters = [
                    { field: 'tags', key: message.topics[i], relation: 'exists' },
                ];
                queues.push(this.app.createNotification(notification));
            }
            return await Promise.all(queues);
        }
        else if (message instanceof dto_1.PushNotificationMessageUserDTO) {
            const notification = this.constructBaseMessage(message);
            notification.include_external_user_ids = message.user_ids;
            queues.push(this.app.createNotification(notification));
            return await Promise.all(queues);
        }
        else if (message instanceof dto_1.PushNotificationMessageFilterDTO) {
            const notification = this.constructBaseMessage(message);
            notification.filters = message.filters;
            queues.push(this.app.createNotification(notification));
            return await Promise.all(queues);
        }
        throw new Error(`Message type '${message.constructor.name}' is not supported`);
    }
    close() {
        //no need implementation
    }
}
exports.PNOneSignalAdapter = PNOneSignalAdapter;
//# sourceMappingURL=pn-onesignal.adapter.js.map