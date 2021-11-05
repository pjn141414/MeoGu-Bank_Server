import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import Account from 'src/models/account';
import AccountRepository from '../account/repositories/account.repository';
import SendPayDto from './dto/sendPay';
import TransactionRepository from './repoisotories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) { }

  /**
   * @description 계좌 송금
   */
  async sendPay(sendPayDto: SendPayDto): Promise<any> {
    const { sendAccountNum, receiveAccountNum, sendAccountPw }:
      { sendAccountNum: string, receiveAccountNum: string, sendAccountPw: string } = sendPayDto;
    if (sendAccountNum === receiveAccountNum) {
      throw new ForbiddenException('수신 계좌에는 송금할 수 없습니다.');
    }

    let account: Account = await this.accountRepository.getAccountByAccountNum(sendAccountNum);
    if (account.password !== sendAccountPw) {
      throw new UnauthorizedException('올바르지 않은 비밀번호입니다.');
    }

  }
}
