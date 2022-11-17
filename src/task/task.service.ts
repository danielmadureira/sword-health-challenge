import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import { format as sprintf } from 'util';

import { User } from '../user/user.entity';
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
  ) {}

  async createTask(params: CreateTaskParams): Promise<Task> {
    const notificationMessage = sprintf(
      'The tech "%s" performed the task "%s..." on date %s.',
      params.creator.username,
      params.summary.substring(0, 30),
      params.date.toISOString().substring(0, 10),
    );

    this.notificationService.createNotification(notificationMessage);

    return await this.taskRepository.save(params);
  }

  async findTask({ id }: TaskSearchFilter): Promise<Task> {
    return await this.taskRepository.findOneByOrFail({ id });
  }

  async listTasks(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async updateTask(
    filter: TaskSearchFilter,
    params: UpdateTaskParams,
  ): Promise<any> {
    const task = await this.taskRepository.findOneByOrFail(filter);

    const updatedTask = {
      id: task.id,
      ...params,
    };

    return await this.taskRepository.save(updatedTask);
  }

  async deleteTask({ id }: TaskSearchFilter): Promise<void> {
    const task = await this.taskRepository.findOneByOrFail({ id });
    await this.taskRepository.delete(task);
  }
}
