import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionService } from 'src/encryption/encryption.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';

import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [NotificationModule, TypeOrmModule.forFeature([Task])],
  providers: [TaskService, NotificationService, EncryptionService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
