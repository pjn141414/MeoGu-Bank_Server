import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/models/account';
import AccountRepository from '../account/repositories/account.repository';
import ReceiveRepository from './repoisotories/receive.repository';
import SendRepository from './repoisotories/send.repository';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountRepository, SendRepository, ReceiveRepository])],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule { }
