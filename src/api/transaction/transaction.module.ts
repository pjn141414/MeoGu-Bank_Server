import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from 'src/models/account';
import AccountRepository from '../account/repositories/account.repository';
import TransactionRepository from './repoisotories/transaction.repository';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountRepository, TransactionRepository])],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule { }
