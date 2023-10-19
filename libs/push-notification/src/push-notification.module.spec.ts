import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationModule } from './push-notification.module';

describe('PushNotificationModule', () => {
  let service: PushNotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PushNotificationModule.register({
          defaultProvider: 'test',
          adapters: {
            test: {
              send: jest.fn(),
              close: jest.fn(),
            },
          },
        }),
      ],
    }).compile();

    service = module.get<PushNotificationService>(PushNotificationService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
});
