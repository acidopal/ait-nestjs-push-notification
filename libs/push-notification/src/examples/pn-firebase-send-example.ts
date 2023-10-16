import {
  PNFirebaseAdapter,
  PushNotificationMessageTopicsDTO,
  PushNotificationService,
} from '../';

async function main() {
  const service = new PushNotificationService({
    defaultProvider: 'firebase',
    adapters: {
      firebase: new PNFirebaseAdapter({}),
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
      ),
    ),
  );
}

main();
