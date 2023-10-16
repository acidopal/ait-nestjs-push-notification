import { Inject, Injectable } from '@nestjs/common';
import { PushNotificationConfig } from './interfaces';
import { PushNotificationMessageDTO } from './dto';
import { PushNotificationAdapter } from './adapters';

@Injectable()
export class PushNotificationService {
  constructor(
    @Inject(PushNotificationConfig)
    private readonly config: PushNotificationConfig,
  ) {
    if (this.config.adapters[this.config.defaultProvider] == null)
      this.invalidProvider();
  }

  getAdapter<T extends PushNotificationAdapter = PushNotificationAdapter>(
    provider?: string,
  ): T {
    return this.config.adapters[provider ?? this.config.defaultProvider] as T;
  }

  async send(message: PushNotificationMessageDTO, provider?: string) {
    const adapter = this.getAdapter(provider);
    if (adapter == null) {
      this.invalidProvider();
    }
    return adapter.send(message);
  }

  invalidProvider() {
    throw new Error('Invalid Push Notification Provider');
  }
}
