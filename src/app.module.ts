import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import CatchException from './lib/error/catchException';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: CatchException,
  }],
})
export class AppModule { }
