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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PNFirebaseAdapter = void 0;
const dto_1 = require("../dto");
const push_notification_adapter_1 = require("./push-notification.adapter");
const firebase = __importStar(require("firebase-admin"));
/**
 * Adapter for Firebase Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain device ids
 * - PushNotificationMessageUserDTO -> send message to certain FCM user id,
 * appending userPrefix with input user_id as 1 topic name, for example `external_id-1`
 * - PushNotificationMessageTopicsDTO -> send message to certain FCM topics
 */
class PNFirebaseAdapter extends push_notification_adapter_1.PushNotificationAdapter {
    constructor({ init = true, serviceAccount, name, destroyOnClose, userPrefix = 'external_id-', }) {
        super();
        if (init) {
            this.app = firebase.initializeApp({
                credential: serviceAccount
                    ? firebase.credential.cert(serviceAccount)
                    : firebase.credential.applicationDefault(),
            }, name);
            this.name = name;
        }
        else {
            this.app = firebase.app(name);
        }
        this.init = init;
        this.destroyOnClose = destroyOnClose;
        this.userPrefix = userPrefix;
    }
    async send(message) {
        const baseMessage = {
            notification: {
                title: message.title,
                body: message.body,
                imageUrl: message.imageUrl,
            },
            data: message.data,
        };
        const queues = [];
        if (message instanceof dto_1.PushNotificationMessageDevicesDTO) {
            const chunkSize = 500;
            for (let i = 0; i < message.device_ids.length; i += chunkSize) {
                const chunkTokens = message.device_ids.slice(i, i + chunkSize);
                queues.push(this.app.messaging().sendEachForMulticast(Object.assign({ tokens: chunkTokens }, baseMessage)));
            }
            return await Promise.all(queues);
        }
        else if (message instanceof dto_1.PushNotificationMessageTopicsDTO) {
            const chunkSize = 500;
            for (let i = 0; i < message.topics.length; i += chunkSize) {
                queues.push(this.app.messaging().sendEach(message.topics.slice(i, i + chunkSize).map((topic) => (Object.assign({ topic: topic }, baseMessage)))));
            }
            return await Promise.all(queues);
        }
        else if (message instanceof dto_1.PushNotificationMessageUserDTO) {
            const chunkSize = 500;
            for (let i = 0; i < message.user_ids.length; i += chunkSize) {
                queues.push(this.app.messaging().sendEach(message.user_ids.slice(i, i + chunkSize).map((userId) => (Object.assign({ topic: this.userPrefix + userId }, baseMessage)))));
            }
            return await Promise.all(queues);
        }
        throw new Error(`Message type '${message.constructor.name}' is not supported`);
    }
    close() {
        if (this.name && this.init && this.destroyOnClose) {
            this.app.delete();
        }
    }
}
exports.PNFirebaseAdapter = PNFirebaseAdapter;
//# sourceMappingURL=pn-firebase.adapter.js.map