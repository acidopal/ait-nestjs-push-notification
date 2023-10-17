import {
  PushNotificationMessageDTO,
  PushNotificationMessageDevicesDTO,
  PushNotificationMessageTopicsDTO,
  PushNotificationMessageUserDTO,
} from '../dto';
import { PushNotificationAdapter } from './push-notification.adapter';
import * as firebase from 'firebase-admin';

export interface PNFirebaseAdapterConfig {
  /** should this adapter init firebase client, if not will use existing client */
  init?: boolean;
  /**
   * which service account data/path to use, if not will use one specified by environment
   * variable GOOGLE_APPLICATION_CREDENTIALS
   */
  serviceAccount?: string | firebase.ServiceAccount;
  /** Firebase instance name, will use default if not specified */
  name?: string;
  /** Should firebase instance get destroyed when this adapter is removed, default to true */
  destroyOnClose?: boolean;
  /**
   * userPrefix when sending to user ids, will use topic prefix, default to `external_id-`\
   * For example, it will be sent to user id 1, it will send to topic `external_id-1`
   */
  userPrefix?: string;
}

/**
 * Adapter for Firebase Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain device ids
 * - PushNotificationMessageUserDTO -> send message to certain FCM user id,
 * appending userPrefix with input user_id as 1 topic name, for example `external_id-1`
 * - PushNotificationMessageTopicsDTO -> send message to certain FCM topics
 */
export class PNFirebaseAdapter extends PushNotificationAdapter {
  public app: firebase.app.App;
  private name: string;
  private init: boolean;
  private destroyOnClose: boolean;
  private userPrefix: string;
  constructor({
    init = true,
    serviceAccount,
    name,
    destroyOnClose,
    userPrefix = 'external_id-',
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
    this.userPrefix = userPrefix;
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
    } else if (message instanceof PushNotificationMessageUserDTO) {
      const chunkSize = 500;
      for (let i = 0; i < message.user_ids.length; i += chunkSize) {
        queues.push(
          this.app.messaging().sendEach(
            message.user_ids.slice(i, i + chunkSize).map((userId) => ({
              topic: this.userPrefix + userId,
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
