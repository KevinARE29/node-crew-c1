/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { createCipheriv, createDecipheriv } from 'crypto';

const streamifier = require('streamifier');

@Injectable()
export class AppService {
  private readonly iv: string;
  private readonly key: string;

  constructor(private readonly configService: ConfigService) {
    this.iv = this.configService.get<string>('AES_IV');
    this.key = this.configService.get<string>('AES_KEY');
  }

  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    const { name, ext } = parse(file.originalname);
    const destFolder = this.configService.get<string>('DEST_FOLDER');
    const filePath = `${destFolder}/${name}.enc`;
    const env = this.configService.get<string>('NODE_ENV');
    if (env !== 'production') {
      return this.saveOnLocalFolder(filePath, file);
    } else {
      return this.saveOnCloudProvider();
    }
  }

  private async saveOnLocalFolder(filePath: string, file: Express.Multer.File): Promise<void> {
    pipeline(
      streamifier.createReadStream(file.buffer),
      createCipheriv('aes-256-gcm', this.key, this.iv),
      createWriteStream(filePath),
      err => {
        console.error(err);
      },
    );
  }

  private async saveOnCloudProvider(): Promise<void> {}
}
