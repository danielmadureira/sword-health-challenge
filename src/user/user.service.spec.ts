import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

import { RolesEnum } from '../common/enums/roles.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

function generateUserMock(overrideProps = {}): User {
  return {
    id: parseInt(faker.random.numeric(), 10),
    username: faker.name.fullName(),
    password: faker.internet.password(8),
    role: faker.helpers.arrayElement(Object.values(RolesEnum)),
    tasks: [],
    ...overrideProps,
  };
}

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let config: ConfigService;
  let userMock: User;

  beforeEach(async () => {
    userMock = generateUserMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest
              .fn()
              .mockImplementation(() => Promise.resolve(userMock)),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    config = module.get<ConfigService>(ConfigService);
  });

  describe('User creation', () => {
    it('should successfully insert a user', async () => {
      const userDTO = { ...userMock };
      delete userDTO.id;
      const mockHashedPassword = faker.internet.password();
      const mockConfig = faker.random.numeric(2);

      const configSpy = jest
        .spyOn(config, 'get')
        .mockImplementation(() => mockConfig);

      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(mockHashedPassword));

      const createSpy = jest.spyOn(repository, 'create');

      // SUT
      const result = await service.create(userDTO);

      // Assertions
      expect(result).toBe(userMock);
      expect(configSpy).toHaveBeenCalledWith('BCRYPT_ROUNDS');
      expect(hashSpy).toHaveBeenCalledWith(userMock.password, mockConfig);
      expect(createSpy).toHaveBeenCalledWith({
        ...userDTO,
        password: mockHashedPassword,
      });
    });
  });
});
