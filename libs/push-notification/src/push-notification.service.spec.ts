import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationModule } from './push-notification.module';
import { PushNotificationAdapter } from './adapters';
import { PushNotificationMessageDevicesDTO } from './dto';

function createAdapter(): PushNotificationAdapter {
  return {
    send: jest.fn(),
    close: jest.fn(),
  };
}

describe('PushNotificationService', () => {
  let service: PushNotificationService;
  let defaultAdapter: PushNotificationAdapter;
  let notDefaultAdapter: PushNotificationAdapter;

  beforeEach(async () => {
    defaultAdapter = createAdapter();
    notDefaultAdapter = createAdapter();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PushNotificationModule.register({
          defaultProvider: 'test',
          adapters: {
            test: defaultAdapter,
            notDefault: notDefaultAdapter,
          },
        }),
      ],
    }).compile();

    service = module.get<PushNotificationService>(PushNotificationService);
  });

  it('getAdapter should be able to get defaultAdapter if no name provided', () => {
    expect(service).toBeDefined();
    expect(service.getAdapter()).toEqual(defaultAdapter);
  });

  it('getAdapter should be able to get other adapter if name provided', () => {
    expect(service).toBeDefined();
    expect(service.getAdapter('notDefault')).not.toBeNull();
    expect(service.getAdapter('notDefault')).not.toEqual(defaultAdapter);
  });

  it('getAdapter should be able to get other adapter if name provided', () => {
    expect(service).toBeDefined();
    expect(service.getAdapter('notexist')).toBeFalsy();
  });

  it('putAdapter should note replace old adapter if replace undefined/false', () => {
    service.putAdapter('test', () => createAdapter());
    expect(service.getAdapter()).toEqual(defaultAdapter);
    service.putAdapter('test', () => createAdapter(), false);
    expect(service.getAdapter()).toEqual(defaultAdapter);
  });

  it('putAdapter should replace old adapter if replace=true', () => {
    service.putAdapter('test', () => createAdapter(), true);
    expect(service.getAdapter()).not.toEqual(defaultAdapter);
  });

  it('putAdapter should be able to add new adapter, getAdapter should be able to get it', () => {
    const newAdapter = createAdapter();
    service.putAdapter('test-2', () => newAdapter);
    expect(service.getAdapter('test-2')).toEqual(newAdapter);
  });

  it('removeAdapter should be able to remove adapters', () => {
    expect(service.getAdapter('notDefault')).not.toBeNull();
    service.removeAdapter('notDefault');
    expect(service.getAdapter('notDefault')).toBeNull();
  });

  it('send should be able to send using default adapter', () => {
    service.send(
      new PushNotificationMessageDevicesDTO({
        device_ids: ['123'],
      }),
    );
    expect(defaultAdapter.send).toBeCalledTimes(1);
    expect(notDefaultAdapter.send).toBeCalledTimes(0);
  });

  it('send should be able to send using default adapter', () => {
    service.send(
      new PushNotificationMessageDevicesDTO({
        device_ids: ['123'],
      }),
      'notDefault',
    );
    expect(defaultAdapter.send).toBeCalledTimes(0);
    expect(notDefaultAdapter.send).toBeCalledTimes(1);
  });
});
