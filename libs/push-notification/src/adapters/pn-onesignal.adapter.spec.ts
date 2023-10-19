import * as OneSignal from '@onesignal/node-onesignal';
import { PNOneSignalAdapter } from './pn-onesignal.adapter';
import {
  PushNotificationMessageDevicesDTO,
  PushNotificationMessageFilterDTO,
  PushNotificationMessageTopicsDTO,
  PushNotificationMessageUserDTO,
} from '../dto';

describe('PNOneSignalAdapter', () => {
  let app: OneSignal.DefaultApi;
  let baseMessage;

  beforeEach(async () => {
    baseMessage = {
      title: 'Title',
      body: 'Test',
      data: {
        test: 'test',
      },
      imageUrl: 'https://placehold.co/400x200/000000/FFFFFF.png',
    };
    app = {
      createNotification: jest.fn(),
    } as any;
    jest.spyOn(OneSignal, 'createConfiguration').mockReturnValue({} as any);
    jest.spyOn(OneSignal, 'DefaultApi').mockReturnValue(app);
  });

  it('adapter should have app instantiated', () => {
    const adapter = new PNOneSignalAdapter({ appId: 'id' });
    expect(adapter.app).toEqual(app);
  });

  it('send should send correct parameter batch with PushNotificationMessageDevicesDTO', async () => {
    const adapter = new PNOneSignalAdapter({ appId: 'id' });
    await adapter.send(
      new PushNotificationMessageDevicesDTO({
        device_ids: Array(2100).fill('1'),
        ...baseMessage,
      }),
    );
    expect(app.createNotification).toBeCalledWith(
      Object.assign(adapter.constructBaseMessage(baseMessage), {
        include_player_ids: Array(2000).fill('1'),
      }),
    );
    expect(app.createNotification).toBeCalledWith(
      Object.assign(adapter.constructBaseMessage(baseMessage), {
        include_player_ids: Array(100).fill('1'),
      }),
    );
  });

  it('send should send correct parameter batch with PushNotificationMessageTopicsDTO', async () => {
    const adapter = new PNOneSignalAdapter({ appId: 'id' });
    await adapter.send(
      new PushNotificationMessageTopicsDTO({
        topics: Array(5).fill('1'),
        ...baseMessage,
      }),
    );
    expect(app.createNotification).toBeCalledWith(
      Object.assign(adapter.constructBaseMessage(baseMessage), {
        filters: [{ field: 'tag', key: '1', relation: 'exists' }],
      }),
    );
    expect(app.createNotification).toBeCalledTimes(5);
  });

  it('send should send correct parameter batch with PushNotificationMessageUserDTO', async () => {
    const adapter = new PNOneSignalAdapter({ appId: 'id' });
    await adapter.send(
      new PushNotificationMessageUserDTO({
        user_ids: Array(2100).fill('1'),
        ...baseMessage,
      }),
    );
    expect(app.createNotification).toBeCalledWith(
      Object.assign(adapter.constructBaseMessage(baseMessage), {
        include_external_user_ids: Array(2000).fill('1'),
      }),
    );
    expect(app.createNotification).toBeCalledWith(
      Object.assign(adapter.constructBaseMessage(baseMessage), {
        include_external_user_ids: Array(100).fill('1'),
      }),
    );
  });

  it('send should send correct parameter batch with PushNotificationMessageFilterDTO', async () => {
    const adapter = new PNOneSignalAdapter({ appId: 'id' });
    await adapter.send(
      new PushNotificationMessageFilterDTO({
        filters: [{ field: 'tag', key: '1', relation: 'exists' }],
        ...baseMessage,
      }),
    );
    expect(app.createNotification).toBeCalledWith(
      Object.assign(adapter.constructBaseMessage(baseMessage), {
        filters: [{ field: 'tag', key: '1', relation: 'exists' }],
      }),
    );
  });
});
