import {
  PushNotificationMessageDTO,
  PushNotificationMessageDevicesDTO,
  PushNotificationMessageTopicsDTO,
} from '../dto';
import { PushNotificationAdapter } from './push-notification.adapter';
import * as firebase from 'firebase-admin';

export interface PNFirebaseAdapterConfig {
  init?: boolean;
  serviceAccount?: string | firebase.ServiceAccount;
}

export class PNFirebaseAdapter extends PushNotificationAdapter {
  public app: firebase.app.App;
  constructor({ init = true, serviceAccount }: PNFirebaseAdapterConfig) {
    super();
    if (init) {
      this.app = firebase.initializeApp({
        credential: serviceAccount
          ? firebase.credential.cert(serviceAccount)
          : firebase.credential.applicationDefault(),
      });
    } else {
      this.app = firebase.app();
    }
  }

  async send(message: PushNotificationMessageDTO): Promise<any> {
    const baseMessage = {
      notification: {
        title: message.title,
        body: message.body,
        imageUrl: message.imageUrl,
      },
      data: message.data,
    };
    if (message instanceof PushNotificationMessageDevicesDTO) {
      return this.app.messaging().sendEachForMulticast({
        tokens: message.device_ids,
        ...baseMessage,
      });
    } else if (message instanceof PushNotificationMessageTopicsDTO) {
      return this.app.messaging().sendEach(
        message.topics.map((topic) => ({
          topic: topic,
          ...baseMessage,
        })),
      );
    }
    throw new Error(
      `Message type '${message.constructor.name}' is not supported`,
    );
  }
}
