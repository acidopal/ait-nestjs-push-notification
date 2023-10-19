import * as firebase from 'firebase-admin';
import { PNFirebaseAdapter } from './pn-firebase.adapter';
import {
  PushNotificationMessageDevicesDTO,
  PushNotificationMessageTopicsDTO,
  PushNotificationMessageUserDTO,
} from '../dto';

describe('PNFirebaseAdapter', () => {
  let app: firebase.app.App;
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
    const messaging = {
      sendEach: jest.fn(),
      sendEachForMulticast: jest.fn().mockResolvedValue(true),
    };
    app = {
      appCheck: jest.fn(),
      auth: jest.fn(),
      database: jest.fn(),
      firestore: jest.fn(),
      installations: jest.fn(),
      instanceId: jest.fn(),
      machineLearning: jest.fn(),
      messaging: () => messaging as any,
      projectManagement: jest.fn(),
      remoteConfig: jest.fn(),
      securityRules: jest.fn(),
      storage: jest.fn(),
      delete: jest.fn(),
      name: 'app',
      options: {},
    };
    jest.spyOn(firebase, 'initializeApp').mockReturnValue(app);
    jest.spyOn(firebase, 'app').mockReturnValue(app);
  });

  it('adapter should call initializeApp if init is true/not specified with correct name', () => {
    new PNFirebaseAdapter({ name: 'name' });
    expect(firebase.initializeApp).toBeCalledWith(expect.anything(), 'name');
    jest.spyOn(firebase, 'initializeApp').mockClear();
    new PNFirebaseAdapter({ init: true, name: 'name' });
    expect(firebase.initializeApp).toBeCalledWith(expect.anything(), 'name');
  });

  it('adapter should call app if init is false with correct name', () => {
    new PNFirebaseAdapter({ init: false, name: 'name' });
    expect(firebase.app).toBeCalledWith('name');
  });

  it('send should send correct parameter batch with PushNotificationMessageDevicesDTO', async () => {
    const adapter = new PNFirebaseAdapter({});
    await adapter.send(
      new PushNotificationMessageDevicesDTO({
        device_ids: Array(700).fill('1'),
        ...baseMessage,
      }),
    );
    expect(app.messaging().sendEachForMulticast).toBeCalledWith({
      tokens: Array(500).fill('1'),
      notification: {
        title: baseMessage.title,
        body: baseMessage.body,
        imageUrl: baseMessage.imageUrl,
      },
      data: baseMessage.data,
    });
    expect(app.messaging().sendEachForMulticast).toBeCalledWith({
      tokens: Array(200).fill('1'),
      notification: {
        title: baseMessage.title,
        body: baseMessage.body,
        imageUrl: baseMessage.imageUrl,
      },
      data: baseMessage.data,
    });
  });

  it('send should send correct parameter batch with PushNotificationMessageTopicsDTO', async () => {
    const adapter = new PNFirebaseAdapter({});
    await adapter.send(
      new PushNotificationMessageTopicsDTO({
        topics: Array(700).fill('1'),
        ...baseMessage,
      }),
    );
    expect(app.messaging().sendEach).toBeCalledWith(
      Array(500).fill({
        topic: '1',
        notification: {
          title: baseMessage.title,
          body: baseMessage.body,
          imageUrl: baseMessage.imageUrl,
        },
        data: baseMessage.data,
      }),
    );
    expect(app.messaging().sendEach).toBeCalledWith(
      Array(200).fill({
        topic: '1',
        notification: {
          title: baseMessage.title,
          body: baseMessage.body,
          imageUrl: baseMessage.imageUrl,
        },
        data: baseMessage.data,
      }),
    );
  });

  it('send should send correct parameter batch with PushNotificationMessageUserDTO', async () => {
    const adapter = new PNFirebaseAdapter({ userPrefix: 'prefix-' });
    await adapter.send(
      new PushNotificationMessageUserDTO({
        user_ids: Array(700).fill('1'),
        ...baseMessage,
      }),
    );
    expect(app.messaging().sendEach).toBeCalledWith(
      Array(500).fill({
        topic: 'prefix-1',
        notification: {
          title: baseMessage.title,
          body: baseMessage.body,
          imageUrl: baseMessage.imageUrl,
        },
        data: baseMessage.data,
      }),
    );
    expect(app.messaging().sendEach).toBeCalledWith(
      Array(200).fill({
        topic: 'prefix-1',
        notification: {
          title: baseMessage.title,
          body: baseMessage.body,
          imageUrl: baseMessage.imageUrl,
        },
        data: baseMessage.data,
      }),
    );
  });

  it('should delete app when adapter closed and destroyOnClose true and have name', async () => {
    let adapter = new PNFirebaseAdapter({});
    adapter.close();
    adapter = new PNFirebaseAdapter({ destroyOnClose: true });
    adapter.close();
    adapter = new PNFirebaseAdapter({ destroyOnClose: true, name: 'name' });
    adapter.close();
    expect(app.delete).toBeCalledTimes(1);
  });
});
