import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../common/enums/roles.enum';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(RolesEnum.TECHNICIAN)
  getUser(@Request() req) {
    return req.user;
  }

  @Post()
  @Roles(RolesEnum.MANAGER)
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }
}
