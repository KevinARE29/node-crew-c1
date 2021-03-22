import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'path';
import { createWriteStream, createReadStream } from 'fs';
import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv } from 'crypto';
import { createGzip, createGunzip } from 'zlib';
import { Response } from 'express';
import * as sharp from 'sharp';

const promisePipeline = promisify(pipeline);

@Injectable()
export class AppService {
  private readonly iv: string;
  private readonly key: string;
  private readonly destFolder: string;
  private readonly imgWhitelist: string[];

  constructor(private readonly configService: ConfigService) {
    this.iv = this.configService.get<string>('AES_IV');
    this.key = this.configService.get<string>('AES_KEY');
    this.destFolder = this.configService.get<string>('DEST_FOLDER');
    this.imgWhitelist = this.configService.get<string>('IMAGES_EXTENSION_WHITE_LIST')?.split(',');
  }

  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    try {
      const { name, ext } = parse(file.originalname);
      const filePath = `${this.destFolder}/${name}${ext}.gz.enc`;
      const fileStream = Readable.from(file.buffer);

      await promisePipeline(
        fileStream,
        createGzip(),
        createCipheriv('aes-256-ctr', this.key, this.iv),
        createWriteStream(filePath),
      );

      if (this.imgWhitelist.includes(ext.toLowerCase().replace('.', ''))) {
        const thumbnailStream = Readable.from(file.buffer);
        const thumbnailPath = `${this.destFolder}/${name}-thumbnail${ext}.gz.enc`;
        const resizeImage = sharp().resize({ width: 100, height: 100 });

        await promisePipeline(
          thumbnailStream,
          resizeImage,
          createGzip(),
          createCipheriv('aes-256-ctr', this.key, this.iv),
          createWriteStream(thumbnailPath),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async downloadFile(path: string, res: Response): Promise<void> {
    try {
      res.attachment(path);
      const fileStream = createReadStream(`${this.destFolder}/${path}.gz.enc`);
      await promisePipeline(fileStream, createDecipheriv('aes-256-ctr', this.key, this.iv), createGunzip(), res);
    } catch (err) {
      console.error(err);
    }
  }
}
