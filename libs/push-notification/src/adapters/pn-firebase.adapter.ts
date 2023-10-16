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
  name?: string;
  destroyOnClose?: boolean;
}

/**
 * Adapter for Firebase Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain device ids
 * - PushNotificationMessageTopicsDTO -> send message to certain FCM topics
 */
export class PNFirebaseAdapter extends PushNotificationAdapter {
  public app: firebase.app.App;
  private name: string;
  private init: boolean;
  private destroyOnClose: boolean;
  constructor({
    init = true,
    serviceAccount,
    name,
    destroyOnClose,
  }: PNFirebaseAdapterConfig) {
    super();
    if (init) {
      this.app = firebase.initializeApp(
        {
          credential: serviceAccount
            ? firebase.credential.cert(serviceAccount)
            : firebase.credential.applicationDefault(),
        },
        name,
      );
      this.name = name;
    } else {
      this.app = firebase.app(name);
    }
    this.init = init;
    this.destroyOnClose = destroyOnClose;
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
    const queues: Array<Promise<firebase.messaging.BatchResponse>> = [];
    if (message instanceof PushNotificationMessageDevicesDTO) {
      const chunkSize = 500;
      for (let i = 0; i < message.device_ids.length; i += chunkSize) {
        const chunkTokens = message.device_ids.slice(i, i + chunkSize);
        queues.push(
          this.app.messaging().sendEachForMulticast({
            tokens: chunkTokens,
            ...baseMessage,
          }),
        );
      }
      return await Promise.all(queues);
    } else if (message instanceof PushNotificationMessageTopicsDTO) {
      const chunkSize = 500;
      for (let i = 0; i < message.topics.length; i += chunkSize) {
        queues.push(
          this.app.messaging().sendEach(
            message.topics.slice(i, i + chunkSize).map((topic) => ({
              topic: topic,
              ...baseMessage,
            })),
          ),
        );
      }
      return await Promise.all(queues);
    }
    throw new Error(
      `Message type '${message.constructor.name}' is not supported`,
    );
  }

  close() {
    if (this.name && this.init && this.destroyOnClose) {
      this.app.delete();
    }
  }
}
