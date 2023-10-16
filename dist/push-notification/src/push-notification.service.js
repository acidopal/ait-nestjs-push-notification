"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("./interfaces");
let PushNotificationService = class PushNotificationService {
    constructor(config) {
        this.adapters = Object.assign({}, config.adapters);
        this.defaultProvider = config.defaultProvider;
        if (this.adapters[this.defaultProvider] == null)
            this.invalidProvider();
    }
    /**
     * add / replace PN adapter
     * name - adapter name
     * builder - function to create adapter if adapter should be created
     */
    putAdapter(provider, builder, replace = false) {
        if (this.adapters[provider]) {
            if (!replace) {
                return;
            }
            this.adapters[provider].close();
        }
        this.adapters[provider] = builder();
    }
    /** remove certain adapter from service */
    removeAdapter(provider) {
        this.adapters[provider].close();
        this.adapters[provider] = null;
    }
    /** get adapter with provider name, if empty, use defaultProvider */
    getAdapter(provider) {
        return this.adapters[provider !== null && provider !== void 0 ? provider : this.defaultProvider];
    }
    /** send message using certain provider, or defaultProvider if not provided */
    async send(message, provider) {
        const adapter = this.getAdapter(provider);
        if (adapter == null) {
            this.invalidProvider();
        }
        return adapter.send(message);
    }
    /** throw provider error because no provider found */
    invalidProvider() {
        throw new Error('Invalid Push Notification Provider');
    }
};
PushNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(interfaces_1.PushNotificationConfig)),
    __metadata("design:paramtypes", [interfaces_1.PushNotificationConfig])
], PushNotificationService);
exports.PushNotificationService = PushNotificationService;
//# sourceMappingURL=push-notification.service.js.map