import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

type UserSearchFilter = {
  id?: number;
  username?: string;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  find(filter: UserSearchFilter): Promise<User> {
    const result = this.usersRepository.findOneByOrFail(filter);

    return result;
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    const passwordHash = await bcrypt.hash(
      userData.password,
      this.configService.get<number>('BCRYPT_ROUNDS'),
    );

    const createData = {
      ...userData,
      password: passwordHash,
    };

    return await this.usersRepository.create(createData);
  }
}
