import {
  Controller,
  Request,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolesEnum } from '../common/enums/roles.enum';
import { UpsertTaskDTO } from './dto/upsert-task.dto';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @Roles(RolesEnum.TECHNICIAN)
  createTask(@Request() request, @Body() createTaskDTO: UpsertTaskDTO) {
    return this.taskService.create({
      summary: createTaskDTO.summary,
      date: new Date(createTaskDTO.date),
      creator: request.user,
    });
  }

  @Get()
  @Roles(RolesEnum.MANAGER)
  async listTask() {
    return await this.taskService.list();
  }

  @Get(':taskId')
  @Roles(RolesEnum.TECHNICIAN)
  async getTask(@Param('taskId') taskId: number) {
    try {
      return await this.taskService.find({ id: taskId });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Put(':taskId')
  @Roles(RolesEnum.TECHNICIAN)
  async updateTask(
    @Param('taskId') taskId: number,
    @Body() updateTaskDTO: UpsertTaskDTO,
  ) {
    try {
      return await this.taskService.update({ id: taskId }, updateTaskDTO);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Delete(':taskId')
  @Roles(RolesEnum.MANAGER)
  async deleteTask(@Param('taskId') taskId: number) {
    try {
      return await this.taskService.delete({ id: taskId });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
