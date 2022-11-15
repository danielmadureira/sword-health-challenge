import { Controller, Request, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../common/enums/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Get()
  @Roles(RolesEnum.TECHNICIAN)
  getProfile(@Request() req) {
    return req.user;
  }
}
