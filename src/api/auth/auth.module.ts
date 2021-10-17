import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import UserRepository from '../user/repositories/user.repository';
import EasyPasswordRepository from './repositories/easyPassword.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/models/User';
import EasyPassword from 'src/models/easyPassword';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository, EasyPassword, EasyPasswordRepository])],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
