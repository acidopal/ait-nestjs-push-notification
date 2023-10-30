import { DynamicModule, Global, Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationConfig } from './interfaces';

@Global()
@Module({})
export class PushNotificationModule {
  static register(options: PushNotificationConfig): DynamicModule {
    return {
      module: PushNotificationModule,
      providers: [
        {
          provide: PushNotificationConfig,
          useValue: options,
        },
        PushNotificationService,
      ],
      exports: [PushNotificationService],
    };
  }
}
