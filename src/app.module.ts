import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadService } from './api/upload/upload.service';
import { UploadController } from './api/upload/upload.controller';
import CatchException from './lib/error/catchException';

@Module({
  imports: [],
  controllers: [AppController, UploadController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: CatchException,
  }, UploadService],
})
export class AppModule { }
