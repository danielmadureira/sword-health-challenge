import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TaskModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOSTNAME'),
        port: configService.get<number>('MYSQL_PORT'),
        database: configService.get<string>('MYSQL_DB_NAME'),
        username: configService.get<string>('MYSQL_USER_NAME'),
        password: configService.get<string>('MYSQL_USER_PSWD'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    EncryptionModule,
  ],
})
export class AppModule {}
