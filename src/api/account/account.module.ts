import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/models/account';
import User from 'src/models/User';
import UserRepository from '../user/repositories/user.repository';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import AccountRepository from './repositories/account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository, Account, AccountRepository])],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule { }
