import { DynamicModule, Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationConfig } from './interfaces';

@Module({
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
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
