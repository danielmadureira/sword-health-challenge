import { Injectable } from '@nestjs/common';

import { RolesEnum } from '../common/enums/roles.enum';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      role: RolesEnum.TECHNICIAN,
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      role: RolesEnum.MANAGER,
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
