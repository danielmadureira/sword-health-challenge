import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EncryptionService } from './encryption.service';

describe.only('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((envVarName: string) => {
              if (envVarName === 'ENCRYPTION_KEY_PASSWORD') {
                return '15';
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it("should have it's service defined", () => {
    expect(service).toBeDefined();
  });

  describe('Text encryption', () => {
    it('should successfuly encrypt a string', async () => {
      const textToBeEncrypted = faker.lorem.lines(1);

      // SUT
      const result = await service.encryptText(textToBeEncrypted);

      // Assertions
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).not.toBe(textToBeEncrypted);
    });
  });

  describe('Test decryption', () => {
    it('should successfuly decrypt a encrypted binary string', async () => {
      const textToBeDecrypted = Buffer.from(
        '659f006e69cc2fbb299dacba9343d3e2f46775102f72f0b8e36c17e8f085abfd89ae84baeefd2d7ab06cc72bc781c187ebdb7d032a96c9eb179d0cdb6bbce8a9b0fb1bfe113c499cb0ec',
        'hex',
      );
      const expectedOutput =
        'Tenetur quae tenetur fuga ab omnis ex quasi pariatur quas.';

      // SUT
      const result = await service.decryptText(textToBeDecrypted);

      // Assertions
      expect(typeof result).toBe('string');
      expect(result).toBe(expectedOutput);
    });
  });
});
