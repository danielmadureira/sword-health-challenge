import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { format as sprintf } from 'util';

import { generateUserMock } from '../user/user.service.spec';
import { NotificationService } from '../notification/notification.service';
import { EncryptionService } from '../encryption/encryption.service';
import { Task } from './task.entity';
import { TaskService } from './task.service';

function generateTaskMock(): Task {
  return {
    id: parseInt(faker.random.numeric(), 10),
    summary: Buffer.from(faker.lorem.paragraph(), 'utf-8'),
    date: faker.date.recent(),
    creator: generateUserMock(),
  };
}

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;
  let notificationService: NotificationService;
  let encryptionService: EncryptionService;
  let taskMock: Task;
  let expectedEncryptedText: Buffer;
  let expectedDecryptedText: string;

  beforeEach(async () => {
    taskMock = generateTaskMock();
    expectedDecryptedText = faker.lorem.lines(1);
    expectedEncryptedText = Buffer.from(expectedDecryptedText, 'utf-8');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn().mockResolvedValue(taskMock),
            find: jest.fn().mockResolvedValue([taskMock]),
            findOneByOrFail: jest.fn().mockResolvedValue(taskMock),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            createNotification: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: EncryptionService,
          useValue: {
            encryptText: jest.fn().mockResolvedValue(expectedEncryptedText),
            decryptText: jest.fn().mockResolvedValue(expectedDecryptedText),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    notificationService = module.get<NotificationService>(NotificationService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  it("should have it's service defined", () => {
    expect(service).toBeDefined();
  });

  describe('Task creation', () => {
    it('should successfully insert a user', async () => {
      const expectedSummary = 'This is an example summary';
      const taskDTO = {
        ...taskMock,
        summary: expectedSummary,
      };
      delete taskDTO.id;
      const expectedNotificationMessage = sprintf(
        'The tech "%s" performed the task "%s..." on date %s.',
        taskDTO.creator.username,
        expectedSummary,
        taskDTO.date.toISOString().substring(0, 10),
      );

      // Stubs
      const createNotificationSpy = jest.spyOn(
        notificationService,
        'createNotification',
      );
      const encryptionServiceSpy = jest.spyOn(encryptionService, 'encryptText');
      const decryptionServiceSpy = jest.spyOn(encryptionService, 'decryptText');

      // SUT
      const result = await service.create(taskDTO);

      // Assertions
      expect(createNotificationSpy).toHaveBeenCalledWith(
        expectedNotificationMessage,
      );
      expect(encryptionServiceSpy).toHaveBeenCalledWith(taskDTO.summary);
      expect(decryptionServiceSpy).toHaveBeenCalledWith(taskMock.summary);
      expect(result).toStrictEqual({
        ...taskMock,
        summary: expectedDecryptedText,
      });
    });
  });

  describe('Task recovery', () => {
    it('should get a single user', async () => {
      const encryptionServiceSpy = jest.spyOn(encryptionService, 'decryptText');
      const repoSpy = jest.spyOn(repository, 'findOneByOrFail');

      // SUT
      const result = await service.find({ id: 1 });

      // Assertions
      expect(result).toEqual({
        ...taskMock,
        summary: expectedDecryptedText,
      });
      expect(encryptionServiceSpy).toHaveBeenCalledWith(taskMock.summary);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });

    it('should return an array of users', async () => {
      const resultSize = 3;
      const userArray = [];
      for (let i = 0; i < resultSize; ++i) {
        userArray.push(generateTaskMock());
      }
      const repoSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(userArray);

      // SUT
      const result = await service.list();

      // Assertions
      expect(result.length).toBe(resultSize);
      expect(repoSpy).toHaveBeenCalledTimes(1);
      result.forEach((task) => {
        expect(task.summary).toBe(expectedDecryptedText);
      });
    });
  });

  describe('Task update', () => {
    it('should update a single task', async () => {
      const updateObj = {
        summary: 'New summary',
        date: taskMock.date,
      };

      const encryptionSpy = jest.spyOn(encryptionService, 'encryptText');
      const repoSpy = jest.spyOn(repository, 'save');

      // SUT
      const result = await service.update({ id: taskMock.id }, updateObj);

      // Assertions
      expect(encryptionSpy).toHaveBeenCalledWith(updateObj.summary);
      expect(repoSpy).toHaveBeenCalledWith({
        id: taskMock.id,
        date: taskMock.date,
        summary: expectedEncryptedText,
      });
      expect(result).toStrictEqual({
        ...taskMock,
        summary: expectedDecryptedText,
      });
    });
  });

  describe('Task delete', () => {
    it('should successfuly delete a task', async () => {
      const repoFindSpy = jest.spyOn(repository, 'findOneByOrFail');
      const repoDelSpy = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(null);

      // SUT
      await service.delete({ id: taskMock.id });

      expect(repoFindSpy).toHaveBeenCalledWith({ id: taskMock.id });
      expect(repoDelSpy).toHaveBeenCalledWith(taskMock);
    });
  });
});
