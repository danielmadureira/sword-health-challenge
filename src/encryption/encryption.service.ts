import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptionService {
  constructor(private configService: ConfigService) {}

  async encryptText(text: string): Promise<Buffer> {
    const iv = randomBytes(16);
    const key = await this.getKey();
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

    return Buffer.concat([iv, encryptedText]);
  }

  async decryptText(encryptedData: Buffer): Promise<string> {
    const iv = encryptedData.slice(0, 16);
    const encryptedText = encryptedData.slice(16);
    const key = await this.getKey();
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    return Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]).toString();
  }

  private async getKey(): Promise<Buffer> {
    const keyPassword = this.configService.get<string>(
      'ENCRYPTION_KEY_PASSWORD',
    );
    const promisifiedScrypt = await promisify(scrypt);

    return (await promisifiedScrypt(keyPassword, 'salt', 32)) as Buffer;
  }
}
