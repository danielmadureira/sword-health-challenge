import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

import { generateUserMock } from '../user/user.service.spec';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should have it's service defined", () => {
    expect(service).toBeDefined();
  });

  describe('User validation', () => {
    let findOneSpy;
    let userMock;

    beforeEach(() => {
      userMock = generateUserMock();
      findOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(userMock);
    });

    it('should successfuly validate a user', async () => {
      const userValidationData = {
        username: userMock.username,
        password: faker.internet.password(),
      };

      const bcryptSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => true);

      // SUT
      const result = await service.validateUser(userValidationData);

      // Assertions
      expect(findOneSpy).toHaveBeenCalledWith({
        username: userValidationData.username,
      });
      expect(bcryptSpy).toHaveBeenCalledWith(
        userValidationData.password,
        userMock.password,
      );
      expect(result).toStrictEqual(userMock);
    });

    it('should fail to validate a user', async () => {
      const userValidationData = {
        username: userMock.username,
        password: faker.internet.password(),
      };

      const bcryptSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => false);

      // SUT
      const result = await service.validateUser(userValidationData);

      // Assertions
      expect(findOneSpy).toHaveBeenCalledWith({
        username: userValidationData.username,
      });
      expect(bcryptSpy).toHaveBeenCalledWith(
        userValidationData.password,
        userMock.password,
      );
      expect(result).toBe(null);
    });
  });

  describe('User login', () => {
    it('should successfuly log an user in', async () => {
      const userMock = generateUserMock();
      const expectedToken = faker.internet.password();

      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockImplementation(() => expectedToken);

      // SUT
      const result = service.login({
        userId: userMock.id,
        username: userMock.username,
      });

      // Assertions
      expect(signSpy).toHaveBeenCalledWith({
        username: userMock.username,
        sub: userMock.id,
      });
      expect(result).toStrictEqual({
        access_token: expectedToken,
      });
    });
  });
});
