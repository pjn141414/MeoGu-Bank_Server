import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AccountEnum } from 'src/lib/enum/account';
import hashPassword from 'src/lib/util/hashPassword';
import Account from 'src/models/account';
import Receive from 'src/models/receive';
import AccountRepository from '../account/repositories/account.repository';
import ReceivePayDto from './dto/receivePayDto';
import SendPayDto from './dto/sendPayDto';
import ReceiveRepository from './repoisotories/receive.repository';
import SendRepository from './repoisotories/send.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly sendRepository: SendRepository,
    private readonly receiveRepository: ReceiveRepository,
    private readonly accountRepository: AccountRepository,
  ) { }

  /**
   * @description 송금액 검사
   */
  async checkPay(sendAccountNum: string, pay: number): Promise<number> {
    const sendAccount: Account = await this.accountRepository.getAccountByAccountNum(sendAccountNum);
    const checkSendPay = sendAccount.pay;

    if (pay <= 0 || pay > checkSendPay) {
      throw new BadRequestException('송금액이 0원 이하이거나 보유 금액보다 많을 수 없습니다.');
    }

    if (pay < 10000) {
      pay == pay + 300;
    }

    return pay;
  }

  /**
   * @description 계좌 송금
   */
  async sendPay(sendPayDto: SendPayDto): Promise<any> {
    const { sendAccountNum, receiveAccountNum, sendAccountPw, pay }:
      { sendAccountNum: string, receiveAccountNum: string, sendAccountPw: string, pay: number } = sendPayDto;

    const sendAccount: Account = await this.accountRepository.getAccountByAccountNum(sendAccountNum);
    if (sendAccount.accountNum === receiveAccountNum) {
      throw new ForbiddenException('현재 거래 중인 계좌에는 송금할 수 없습니다.');
    }

    const checkPassword: string = sendAccount.password;
    const hashPw: string = hashPassword(checkPassword);

    const bankCode: string = sendAccountNum.slice(0, 3);
    switch (bankCode) {
      case AccountEnum.JN:
        if (sendAccountPw !== checkPassword) {
          throw new BadRequestException('틀린 계좌 비밀번호입니다.');
        }

        break;
      case AccountEnum.SC:
        if (sendAccountPw !== checkPassword) {
          throw new BadRequestException('틀린 계좌 비밀번호입니다.');
        }

        // this.Check_Kakao_SC(receiveAccountNum, receiveAccountPw);
        break;

      case AccountEnum.SD:
        if (hashPw !== checkPassword) {
          throw new BadRequestException('틀린 계좌 비밀번호입니다.');
        }

        break;

      case AccountEnum.JW:
        if (hashPw !== checkPassword) {
          throw new BadRequestException('틀린 계좌 비밀번호입니다.');
        }

        break;

      default:
        throw new NotFoundException('없는 은행입니다.');
    }

    const checkSendPay = sendAccount.pay;

    if (pay <= 0 || pay > checkSendPay) {
      throw new BadRequestException('송금액이 0원 이하이거나 보유 금액보다 많을 수 없습니다.');
    }

    if (pay < 10000) {
      pay == pay + 300;
    }

    // @todo 송금 api axios

  }

  /**
   * @description 입금 받기
   */
  async receivePay(receivePayDto: ReceivePayDto): Promise<any> {
    const { sendAccountNum, receiveAccountNum, receivePay }:
      { sendAccountNum: string, receiveAccountNum: string, receivePay: number } = receivePayDto;

    let receiveAccount: Account = await this.accountRepository.getAccountByAccountNum(receiveAccountNum);

    const savePay: number = receiveAccount.pay + receivePay;
    receiveAccount.pay = savePay;

    receiveAccount = await this.accountRepository.save(receiveAccount);

    const receive: Receive = this.receiveRepository.create({
      senderId: sendAccountNum,
      receiverId: receiveAccountNum,
      pay: receivePay,
    });
    receive.account = receiveAccount;

    await this.receiveRepository.save(receive);
  }
}
