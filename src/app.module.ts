import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadService } from './api/upload/upload.service';
import { UploadController } from './api/upload/upload.controller';
import CatchException from './lib/error/catchException';
import { AuthModule } from './api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config/ormConfig';
import { AccountModule } from './api/account/account.module';
import { UserModule } from './api/user/user.module';
import { TransactionModule } from './api/transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), AuthModule, AccountModule, UserModule, TransactionModule],
  controllers: [AppController, UploadController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: CatchException,
  }, UploadService],
})
export class AppModule { }
