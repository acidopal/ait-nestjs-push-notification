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
class PNFirebaseAdapter extends push_notification_adapter_1.PushNotificationAdapter {
    constructor({ init = true, serviceAccount }) {
        super();
        if (init) {
            this.app = firebase.initializeApp({
                credential: serviceAccount
                    ? firebase.credential.cert(serviceAccount)
                    : firebase.credential.applicationDefault(),
            });
        }
        else {
            this.app = firebase.app();
        }
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
        if (message instanceof dto_1.PushNotificationMessageDevicesDTO) {
            return this.app.messaging().sendEachForMulticast(Object.assign({ tokens: message.device_ids }, baseMessage));
        }
        else if (message instanceof dto_1.PushNotificationMessageTopicsDTO) {
            return this.app.messaging().sendEach(message.topics.map((topic) => (Object.assign({ topic: topic }, baseMessage))));
        }
        throw new Error(`Message type '${message.constructor.name}' is not supported`);
    }
}
exports.PNFirebaseAdapter = PNFirebaseAdapter;
//# sourceMappingURL=pn-firebase.adapter.js.map