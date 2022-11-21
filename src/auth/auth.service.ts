import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { EntityNotFoundError } from 'typeorm';

import { UserService } from '../user/user.service';
import { ValidateUserDTO } from './dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userValidationData: ValidateUserDTO): Promise<any> {
    let user;
    try {
      user = await this.userService.findOne({
        username: userValidationData.username,
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        return null;
      }

      throw error;
    }

    const isMatch = await bcrypt.compare(
      userValidationData.password,
      user.password,
    );

    if (isMatch) {
      return user;
    }

    return null;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
