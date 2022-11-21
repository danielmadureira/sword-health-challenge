import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { format as sprintf } from 'util';

import { NotificationService } from '../notification/notification.service';
import { EncryptionService } from '../encryption/encryption.service';
import { User } from '../user/user.entity';
import { ReadTaskDTO } from './dto/read-task.dto';
import { Task } from './task.entity';

type UpdateTaskParams = {
  summary: string;
  date: Date;
};

type CreateTaskParams = UpdateTaskParams & { creator: User };

type TaskSearchFilter = {
  id: number;
};

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private notificationService: NotificationService,
    private encryptionService: EncryptionService,
  ) {}

  async create(params: CreateTaskParams): Promise<ReadTaskDTO> {
    const notificationMessage = sprintf(
      'The tech "%s" performed the task "%s..." on date %s.',
      params.creator.username,
      params.summary.substring(0, 30),
      params.date.toISOString().substring(0, 10),
    );

    this.notificationService.createNotification(notificationMessage);

    const encryptedSummary = await this.encryptionService.encryptText(
      params.summary,
    );

    const insertObj = {
      ...params,
      summary: encryptedSummary,
    };

    return this.convertToReadDTO(await this.taskRepository.save(insertObj));
  }

  async find({ id }: TaskSearchFilter): Promise<ReadTaskDTO> {
    const task = await this.taskRepository.findOneByOrFail({ id });

    return this.convertToReadDTO(task);
  }

  async list(): Promise<ReadTaskDTO[]> {
    const entityArray = await this.taskRepository.find();

    return Promise.all(entityArray.map(this.convertToReadDTO.bind(this)));
  }

  async update(
    filter: TaskSearchFilter,
    params: UpdateTaskParams,
  ): Promise<any> {
    const task = await this.taskRepository.findOneByOrFail(filter);

    const encryptedSummary = await this.encryptionService.encryptText(
      params.summary,
    );

    const updatedTask = {
      ...params,
      id: task.id,
      summary: encryptedSummary,
    };

    return this.convertToReadDTO(await this.taskRepository.save(updatedTask));
  }

  async delete({ id }: TaskSearchFilter): Promise<void> {
    const task = await this.taskRepository.findOneByOrFail({ id });
    await this.taskRepository.delete(task);
  }

  private async convertToReadDTO(task: Task): Promise<ReadTaskDTO> {
    const decryptedSummary = await this.encryptionService.decryptText(
      task.summary,
    );

    return {
      ...task,
      summary: decryptedSummary,
    };
  }
}
