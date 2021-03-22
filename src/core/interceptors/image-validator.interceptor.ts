import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileValidatorInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { file } = request;
    const filesWhiteList = this.configService.get<string>('app.extensionsWhiteList.files');
    const allowedExtensions = filesWhiteList.toLowerCase().split(',');
    const fileExtension = file.originalname.toLowerCase().split('.')[1];
    if (!allowedExtensions.includes(fileExtension)) {
      throw new UnsupportedMediaTypeException('File type is not allowed');
    }
    const allowedSize = this.configService.get<number>('allowedSize');
    if (allowedSize < Number(file.size)) {
      throw new UnsupportedMediaTypeException('File size is not allowed');
    }

    return next.handle();
  }
}
