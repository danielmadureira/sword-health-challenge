import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class NotificationService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private configService: ConfigService,
  ) {}

  async createNotification(message: string): Promise<void> {
    const queueName = this.configService.get<string>(
      'RABBITMQ_NOTIFICATION_QUEUE',
    );
    const channel = this.amqpConnection.channel;

    channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(message));
  }
}
