import { faker } from '@faker-js/faker';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let config: ConfigService;
  let amqp: AmqpConnection;
  const exampleQueueName = 'example-queue-name';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((envVarName: string) => {
              if (envVarName === 'RABBITMQ_NOTIFICATION_QUEUE') {
                return exampleQueueName;
              }
              return undefined;
            }),
          },
        },
        {
          provide: AmqpConnection,
          useValue: {
            channel: {
              assertQueue: jest.fn().mockReturnValue(null),
              sendToQueue: jest.fn().mockReturnValue(null),
            },
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    config = module.get<ConfigService>(ConfigService);
    amqp = module.get<AmqpConnection>(AmqpConnection);
  });

  it("should have it's service defined", () => {
    expect(service).toBeDefined();
  });

  describe('Notification creation', () => {
    it('should create a new notification', async () => {
      const notificationMessage = faker.lorem.lines(1);

      const configSpy = jest.spyOn(config, 'get');
      const amqpAssertSpy = jest.spyOn(amqp.channel, 'assertQueue');
      const amqpSendSpy = jest.spyOn(amqp.channel, 'sendToQueue');

      // SUT
      await service.createNotification(notificationMessage);

      // Assertions
      expect(configSpy).toHaveBeenCalledWith('RABBITMQ_NOTIFICATION_QUEUE');
      expect(amqpAssertSpy).toHaveBeenCalledWith(exampleQueueName);
      expect(amqpSendSpy).toHaveBeenCalledWith(
        exampleQueueName,
        Buffer.from(notificationMessage),
      );
    });
  });
});
