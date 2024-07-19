"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PushNotificationModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationModule = void 0;
const common_1 = require("@nestjs/common");
const push_notification_service_1 = require("./push-notification.service");
const interfaces_1 = require("./interfaces");
let PushNotificationModule = PushNotificationModule_1 = class PushNotificationModule {
    static register(options) {
        return {
            module: PushNotificationModule_1,
            providers: [
                {
                    provide: interfaces_1.PushNotificationConfig,
                    useValue: options,
                },
                push_notification_service_1.PushNotificationService,
            ],
            exports: [push_notification_service_1.PushNotificationService],
        };
    }
};
exports.PushNotificationModule = PushNotificationModule;
exports.PushNotificationModule = PushNotificationModule = PushNotificationModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], PushNotificationModule);
//# sourceMappingURL=push-notification.module.js.map