<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/126/126816.png" width="75">
</p>

## Push Notification Modules
This library contains common implementation of sending push notifications through multiple possible providers. For now, it supports Firebase and OneSignal provider.

### How to install
```
yarn add https://github.com/PT-Akar-Inti-Teknologi/ait-nestjs-push-notification.git#tags/v0.0.1
```

## Registering Service
We can initialize the service by importing `PushNotificationModule.register` in main module. the register function contains 2 main parameter:
- defaultProvider: provider name that will be used as default send function
- adapters: map of `providerName` to its `PushNotificationAdapter` implementation. each Adapter implementation will have its own needed parameters, will be explained in next section

For Example:
```ts
@Module({
  imports: [
    PushNotificationModule.register({
      adapters: {
        firebase: new PNFirebaseAdapter({
          serviceAccount: '/home/username/service-account.json'
        }),
      },
      defaultProvider: 'firebase',
    }),
  ],
})
```

## Using Service
You can use the service by injecting it to your existing service.
```ts
@Injectable()
export class YourService {

  constructor(
    private readonly pushNotificationService: PushNotificationService,
    ...
  )
}
```

then call send function whenever you need. 
```ts
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
  Providers.firebase,
);
```

### Available Service Functions

## send
Send notification to target (device_ids, user_ids, topics, filters)
Parameters:
- First parameter is the message payload
- Second parameter is provider name, optional. to use default providerName, don't need to fill

Example:
```ts
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
  Providers.firebase,
);
```

### putAdapter
Add or replace adapter.
Parameters:
- provider - adapter provider name
- builder - function to create adapter if adapter should be created
- replace - when true, if provider already exist, will be replaced

```ts
service.putAdapter('firebase-2', () => new PNFirebaseAdapter({
  serviceAccount: '/home/username/service-account.json'
}), true);
```

### getAdapter
get existing adapter.
Parameters:
- provider - adapter provider name

```ts
service.getAdapter('firebase-2');
```

### removeAdapter
Remove existing adapter.
Parameters:
- provider - adapter provider name

```ts
service.removeAdapter('firebase-2');
```

### Available Provider Adapters
## PNFirebaseAdapter
```ts
new PNFirebaseAdapter({
  init: true, // if true, will init new firebaseApp, default true
  serviceAccount: undefined, // if filled, will use serviceAccount provided, can be path to json or object. default undefined, will use applicationDefault environment variable GOOGLE_APPLICATION_CREDENTIALS
  name: undefined, // firebase app name, if not will use/create default firebase app
  destroyOnClose: false, // default to true, when adapter removed, will delete firebase app
  usePrefix: 'external_id-', // topic prefix to use when sending to user id
});
```

Supported message types:
- PushNotificationMessageDevicesDTO -> send message to certain device ids
- PushNotificationMessageUserDTO -> send message to certain FCM user id, appending userPrefix with input user_id as 1 topic name, for example `external_id-1`
- PushNotificationMessageTopicsDTO -> send message to certain FCM topics

## PNOneSignalAdapter
```ts
new PNOneSignalAdapter({
  appKey: oneSignalConfig.appKey, // REST API Key, see in OneSignal Dashboard > Settings > Key & IDs
  appId: oneSignalConfig.appId, // OneSignal App ID, see in OneSignal Dashboard > Settings > Key & IDs
})
```

Supported message types:
- PushNotificationMessageDevicesDTO -> send message to certain player_ids/subscription_ids
- PushNotificationMessageUserDTO -> send message to certain user id using OneSignal external_id
- PushNotificationMessageTopicsDTO -> send message to certain filter tags with relation `exists`
- PushNotificationMessageFilterDTO -> send message to certain filter tags

### Composing Messages
create Message DTO based on target adapter supported message types.
Base parameters:
- title: message title. Optional
- body: message content. Optional if silent(data) message, Required if notification message.
- imageUrl: image to be delivered in message. Optional
- data: additional payload to be processed by frontend. Optional if notification message, required if silent(data) message.

### PushNotificationMessageFilterDTO
Additional parameters:
- filters: list of filters. only supported by OneSignal. reference: https://documentation.onesignal.com/reference/create-notification#formatting-filters

```ts
new PushNotificationMessageFilterDTO({
  topics: ['all'],
  title: 'Title',
  body: 'Test',
  data: {
    test: 'test',
  },
  imageUrl: 'https://placehold.co/400x200/000000/FFFFFF.png',
})
```

### PushNotificationMessageTopicsDTO
Additional parameters:
- topics: array of topic to be sent

```ts
new PushNotificationMessageTopicsDTO({
  topics: ['all'],
  title: 'Title',
  body: 'Test',
  data: {
    test: 'test',
  },
  imageUrl: 'https://placehold.co/400x200/000000/FFFFFF.png',
})
```

### PushNotificationMessageDevicesDTO
Additional parameters:
- device_ids: array of id/token that's bound to application devices, such as firebase device token, onesignal player_id/subscription_id.

```ts
new PushNotificationMessageDevicesDTO({
  device_ids: ['123123'],
  title: 'Title',
  body: 'Test',
  data: {
    test: 'test',
  },
  imageUrl: 'https://placehold.co/400x200/000000/FFFFFF.png',
})
```

### PushNotificationMessageUserDTO
Additional parameters:
- user_ids: array of user id. frontend app need to link current with logged in user ids to enable this feature.

```ts
new PushNotificationMessageUserDTO({
  user_ids: ['123123'],
  title: 'Title',
  body: 'Test',
  data: {
    test: 'test',
  },
  imageUrl: 'https://placehold.co/400x200/000000/FFFFFF.png',
})
```

## Contributors
- nridwans <mailto: ridwan@akarinti.tech>
