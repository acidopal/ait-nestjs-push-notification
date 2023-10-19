import { Inject, Injectable } from '@nestjs/common';
import { PushNotificationConfig } from './interfaces';
import { PushNotificationMessageDTO } from './dto';
import { PushNotificationAdapter } from './adapters';

@Injectable()
export class PushNotificationService {
  private adapters: Record<string, PushNotificationAdapter>;
  private defaultProvider: string;
  constructor(
    @Inject(PushNotificationConfig)
    config: PushNotificationConfig,
  ) {
    this.adapters = { ...config.adapters };
    this.defaultProvider = config.defaultProvider;
    if (this.adapters[this.defaultProvider] == null) this.invalidProvider();
  }

  /**
   * add / replace PN adapter
   * provider - adapter provider name
   * builder - function to create adapter if adapter should be created
   * replace - when true, if provider already exist, will be replaced
   */
  putAdapter(
    provider: string,
    builder: () => PushNotificationAdapter,
    replace = false,
  ) {
    if (this.adapters[provider]) {
      if (!replace) {
        return;
      }
      this.adapters[provider].close();
    }
    this.adapters[provider] = builder();
  }

  /** remove certain adapter from service */
  removeAdapter(provider: string) {
    this.adapters[provider].close();
    this.adapters[provider] = null;
  }

  /** get adapter with provider name, if empty, use defaultProvider */
  getAdapter<T extends PushNotificationAdapter = PushNotificationAdapter>(
    provider?: string,
  ): T {
    return this.adapters[provider ?? this.defaultProvider] as T;
  }

  /** send message using certain provider, or defaultProvider if not provided */
  async send(message: PushNotificationMessageDTO, provider?: string) {
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
}
