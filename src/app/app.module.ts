import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi = require('joi');
import appConfig from 'src/config/app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        AES_IV: Joi.string().required(),
        AES_KEY: Joi.string().required(),
        DEST_FOLDER: Joi.string().default('./upload'),
        DOCS_EXTENSION_WHITE_LIST: Joi.string().default('doc,docx,xls,xlsx,pdf'),
        IMAGES_EXTENSION_WHITE_LIST: Joi.string().default('jpeg,png'),
        FILE_SIZE_LIMIT_IN_BYTES: Joi.number().default(5242880), // 5MB
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
