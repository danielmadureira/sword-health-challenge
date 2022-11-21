import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';

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

  async findOne(filter: UserSearchFilter): Promise<User> {
    return await this.usersRepository.findOneByOrFail(filter);
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const saltRounds = parseInt(this.configService.get('BCRYPT_ROUNDS'), 10);
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    const createData = {
      ...userData,
      password: passwordHash,
    };

    return await this.usersRepository.save(createData);
  }
}
