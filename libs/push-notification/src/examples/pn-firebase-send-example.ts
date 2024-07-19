import {
  PNFirebaseAdapter,
  PushNotificationMessageDevicesDTO,
  PushNotificationMessageTopicsDTO,
  PushNotificationService,
} from '../';

enum Providers {
  firebase = 'firebase',
}

async function main() {
  const service = new PushNotificationService({
    defaultProvider: Providers.firebase,
    adapters: {
      [Providers.firebase]: new PNFirebaseAdapter({}),
    },
  });

  console.log(
    JSON.stringify(
      await service.send(
        new PushNotificationMessageTopicsDTO({
          topics: ['external_id-110002'],
          title: 'Perubahan Prioritas Tugas',
          body: 'Prioritas tugas Engineering Service (MEPC) berubah menjadi High',
          data: {
            is_read: 'false',
            work_order_number: '0000110',
            description:
              'Prioritas tugas Engineering Service (MEPC) berubah menjadi High',
            title: 'Perubahan Prioritas Tugas',
            type: 'UPDATE',
          },
        }),
        Providers.firebase,
      ),
    ),
  );
}

main();
