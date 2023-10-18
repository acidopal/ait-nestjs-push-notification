import { ConfigurationParameters } from '@onesignal/node-onesignal/dist/configuration';
import {
  PushNotificationMessageDTO,
  PushNotificationMessageDevicesDTO,
  PushNotificationMessageFilterDTO,
  PushNotificationMessageTopicsDTO,
  PushNotificationMessageUserDTO,
} from '../dto';
import { PushNotificationAdapter } from './push-notification.adapter';
import * as OneSignal from '@onesignal/node-onesignal';

export interface PNOneSignalAdapterConfig extends ConfigurationParameters {
  appId: string;
}

/**
 * Adapter for OneSignal Push Notification.\
 * Available Message Types:
 * - PushNotificationMessageDevicesDTO -> send message to certain player_ids/subscription_ids
 * - PushNotificationMessageUserDTO -> send message to certain user id using OneSignal external_id
 * - PushNotificationMessageTopicsDTO -> send message to certain filter tags with relation `exists`
 * - PushNotificationMessageFilterDTO -> send message to certain filter tags
 */
export class PNOneSignalAdapter extends PushNotificationAdapter {
  public app: OneSignal.DefaultApi;
  public appId: string;

  constructor({ appId, ...configParam }: PNOneSignalAdapterConfig) {
    super();
    const configuration = OneSignal.createConfiguration(configParam);
    this.app = new OneSignal.DefaultApi(configuration);
    this.appId = appId;
  }

  constructBaseMessage(
    message: PushNotificationMessageDTO,
  ): OneSignal.Notification {
    const notification = new OneSignal.Notification();
    notification.app_id = this.appId;
    if (message.title) {
      notification.headings = {
        en: message.title,
      };
    }
    if (message.body) {
      notification.contents = {
        en: message.title,
      };
    }
    if (message.imageUrl) {
      notification.big_picture = message.imageUrl;
      notification.ios_attachments = { photo: message.imageUrl };
    }
    notification.data = message.data;
    return notification;
  }

  async send(message: PushNotificationMessageDTO): Promise<any> {
    const queues: Array<Promise<OneSignal.CreateNotificationSuccessResponse>> =
      [];
    if (message instanceof PushNotificationMessageDevicesDTO) {
      const chunkSize = 2000;
      for (let i = 0; i < message.device_ids.length; i += chunkSize) {
        const notification = this.constructBaseMessage(message);
        notification.include_player_ids = message.device_ids.slice(
          i,
          i + chunkSize,
        );
        queues.push(this.app.createNotification(notification));
      }
      return await Promise.all(queues);
    } else if (message instanceof PushNotificationMessageTopicsDTO) {
      for (let i = 0; i < message.topics.length; i++) {
        const notification = this.constructBaseMessage(message);
        notification.filters = [
          { field: 'tag', key: message.topics[i], relation: 'exists' },
        ];
        queues.push(this.app.createNotification(notification));
      }
      return await Promise.all(queues);
    } else if (message instanceof PushNotificationMessageUserDTO) {
      const notification = this.constructBaseMessage(message);
      notification.include_external_user_ids = message.user_ids;
      queues.push(this.app.createNotification(notification));
      return await Promise.all(queues);
    } else if (message instanceof PushNotificationMessageFilterDTO) {
      const notification = this.constructBaseMessage(message);
      notification.filters = message.filters as OneSignal.Filter[];
      queues.push(this.app.createNotification(notification));
      return await Promise.all(queues);
    }
    throw new Error(
      `Message type '${message.constructor.name}' is not supported`,
    );
  }

  close() {
    //no need implementation
  }
}
