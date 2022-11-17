import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_URL'),
        connectionInitOptions: { wait: false },
        channels: {
          notifications: {
            prefetchCount: 15,
            default: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationService],
  exports: [RabbitMQModule],
})
export class NotificationModule {}
