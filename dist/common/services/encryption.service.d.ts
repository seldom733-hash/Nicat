import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class EncryptionService implements OnModuleInit {
    private readonly configService;
    private readonly algorithm;
    private key;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    encrypt(text: string): {
        encrypted: string;
        iv: string;
    };
    decrypt(encryptedText: string, iv: string): string;
    encryptPassportData(passportData: {
        passportNumber: string;
        nationality: string;
        expiryDate: string;
    }): {
        encrypted: string;
        iv: string;
    };
    decryptPassportData(encryptedData: string, iv: string): {
        passportNumber: string;
        nationality: string;
        expiryDate: string;
    };
    encryptField(value: string): {
        encrypted: string;
        iv: string;
    };
    decryptField(encrypted: string, iv: string): string;
}
