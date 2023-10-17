import {
  PNOneSignalAdapter,
  PushNotificationMessageTopicsDTO,
  PushNotificationService,
} from '../';
import oneSignalConfig from './pn-onesignal-env.local';

enum Providers {
  onesignal = 'onesignal',
}

async function main() {
  const service = new PushNotificationService({
    defaultProvider: Providers.onesignal,
    adapters: {
      [Providers.onesignal]: new PNOneSignalAdapter({
        appKey: oneSignalConfig.appKey,
        appId: oneSignalConfig.appId,
      }),
    },
  });

  console.log(
    JSON.stringify(
      await service.send(
        new PushNotificationMessageTopicsDTO({
          topics: ['all'],
          title: 'Title',
          body: 'Test',
          data: {
            test: 'test',
          },
          imageUrl: 'https://placehold.co/400x200/000000/FFFFFF.png',
        }),
        Providers.onesignal,
      ),
    ),
  );
}

main();
