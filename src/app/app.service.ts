import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from 'path';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async uploadFile(file: Express.Multer.File): Promise<void> {
    const { name, ext } = parse(file.originalname);
    const destFolder = this.configService.get<string>('DEST_FOLDER');
    const filePath = `${destFolder}/${name}`;
    const env = this.configService.get<string>('NODE_ENV');
    if (env !== 'production') {
      return this.saveOnLocalFolder(filePath, file);
    } else {
      return this.saveOnCloudProvider();
    }
  }

  private async saveOnLocalFolder(filePath: string, file: Express.Multer.File): Promise<void> {
    console.log('ENTRA');
  }

  private async saveOnCloudProvider(): Promise<void> {}
}
