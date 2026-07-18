import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService implements OnModuleInit {
  private readonly algorithm = 'aes-256-cbc';
  private key: Buffer;
  private readonly logger = new Logger(EncryptionService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (encryptionKey) {
      this.key = Buffer.from(encryptionKey, 'hex');
    } else {
      this.key = crypto.randomBytes(32);
      const env = this.configService.get<string>('NODE_ENV', 'development');
      if (env === 'production') {
        this.logger.error('ENCRYPTION_KEY not set in production! Data will be lost on restart.');
      } else {
        this.logger.warn('ENCRYPTION_KEY not set. Using random key (data will not persist across restarts).');
      }
    }
  }

  encrypt(text: string): { encrypted: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted,
      iv: iv.toString('hex'),
    };
  }

  decrypt(encryptedText: string, iv: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  encryptPassportData(passportData: {
    passportNumber: string;
    nationality: string;
    expiryDate: string;
  }): { encrypted: string; iv: string } {
    const dataString = JSON.stringify(passportData);
    return this.encrypt(dataString);
  }

  decryptPassportData(encryptedData: string, iv: string): {
    passportNumber: string;
    nationality: string;
    expiryDate: string;
  } {
    const decryptedString = this.decrypt(encryptedData, iv);
    return JSON.parse(decryptedString);
  }

  encryptField(value: string): { encrypted: string; iv: string } {
    return this.encrypt(value);
  }

  decryptField(encrypted: string, iv: string): string {
    return this.decrypt(encrypted, iv);
  }
}
