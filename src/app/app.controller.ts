import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AppService } from './app.service';
import { MultipartGuard } from '../core/guards/multipart.guard';
import { FileValidatorInterceptor } from '../core/interceptors/image-validator.interceptor';
import { FileDto } from './dtos/request/file.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseGuards(MultipartGuard)
  @UseInterceptors(FileInterceptor('file'), FileValidatorInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileDto })
  @Post('upload')
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.appService.uploadFile(file);
  }

  @Get(':path')
  downloadFile(@Param('path') path: string, @Res() res: Response): Promise<void> {
    return this.appService.downloadFile(path, res);
  }
}
