import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  ) {}

  async createTask(params: CreateTaskParams): Promise<Task> {
    // @TODO: Notify managers upon task creation.
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
