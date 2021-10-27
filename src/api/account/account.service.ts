import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { DealType } from 'src/lib/enum/dealType';
import { EndPoints } from 'src/lib/enum/endPoints';
import uuid from 'src/lib/uuid/uuid';
import Account from 'src/models/account';
import User from 'src/models/User';
import UserRepository from '../user/repositories/user.repository';
import AddAccountDto from './dto/addAccountDto';
import CreateAccountDto from './dto/createAccountDto';
import AccountRepository from './repositories/account.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
  ) { }

  /**
   * @description 계좌 전체 조회
   */
  async getAccounts(): Promise<Account[]> {
    return await this.accountRepository.getAccounts();

  }

  /**
   * @description 계좌번호로 특정 자은행 계좌 조회
   */
  async getAccountByAccountNum(accountNum: string): Promise<Account | undefined> {
    const account: Account | undefined = await this.accountRepository.getAccountByAccountNum(accountNum);
    if (account === undefined) {
      throw new NotFoundException('없는 계좌입니다.');
    }

    return account;
  }

  /**
   * @description 유저 전화번호로 해당 유저의 자은행 계좌 조회
   */
  async getAccountsByUserPhone(phone: string): Promise<Account[]> {
    const userPhone: User | undefined = await this.userRepository.getUserByPhone(phone);
    if (userPhone === undefined) {
      throw new NotFoundException('해당 전화번호를 가진 유저가 없습니다.');
    }

    const userId: string = userPhone.id;
    const account: Account[] = await this.accountRepository.getAccountsByUserId(userId);

    return account;
  }

  /**
   * @description 유저 전화번호로 해당 유저의 타은행 계좌 조회
   */
  async getOtherAccountsByUserPhone(user: User): Promise<any> {
    const userPhone: User | undefined = await this.userRepository.getUserByPhone(user.phone);
    if (userPhone.phone === undefined) {
      throw new NotFoundException('해당 전화번호를 가진 유저가 없습니다.');
    }

    const account = await axios.get(`${EndPoints.SC}/communication/${userPhone.phone}`);

    return account.data;
  }

  /**
   * @description 계좌 개설
   */
  async createAccount(user: User, createAccountDto: CreateAccountDto): Promise<string> {
    const { name, password }: { name: string, password: string } = createAccountDto;

    const userPhone: User | undefined = await this.userRepository.getUserByPhone(user.phone);

    let accountNum: string;
    while (true) {
      // uuid 생성
      accountNum = uuid();

      // 생성한 uuid와 겹치는 계좌 번호가 있는지 확인
      const existAccount = await this.accountRepository.getAccountByAccountNum(accountNum);
      if (existAccount !== undefined) {
        continue; // 존재하면 다시 처음으로
      }

      break; // 존재하지 않는다면 반복문을 벗어난다
    }

    const regex = /^[0-9]{4}$/;
    if (!regex.test(password)) {
      throw new BadRequestException('계좌 비밀번호는 숫자 4자리만 가능합니다.');
    }

    const account = this.accountRepository.create({
      accountNum: accountNum,
      name: name,
      password: password,
      pay: 10000,
    });
    account.user = userPhone;

    await this.accountRepository.save(account);

    return account.accountNum;
  }

  /**
  * @description 계좌 추가
  */
  async addAccount(user: User, addAccountDto: AddAccountDto): Promise<string> {
    const { accountNum, name, password, pay }:
      { accountNum: string, name: string, password: string, pay: number } = addAccountDto;

    const userPhone: User | undefined = await this.userRepository.getUserByPhone(user.phone);
    if (userPhone === undefined) {
      throw new NotFoundException('해당 전화번호를 가진 유저가 없습니다.');
    }

    const checkAccount = accountNum.slice(0, 3);
    if (checkAccount.length < 3) {
      throw new BadRequestException('올바르지 않은 계좌번호입니다.');
    }

    while (true) {
      const existAccount: Account | undefined = await this.accountRepository.getAccountByAccountNum(accountNum);
      if (existAccount !== undefined) {
        continue;
      }

      break;
    }

    const account = this.accountRepository.create({
      accountNum: accountNum,
      name: name,
      password: password,
      pay: pay,
    });
    account.user = userPhone;

    await this.accountRepository.save(account);

    return account.accountNum;
  }

  /**
  * @description 자은행 총 보유 금액 조회
  */
  async getMeoguHold(): Promise<Account[]> {
    return await this.accountRepository.getMeoguHold();
  }

  /**
   * @description 자은행 고객별 총 보유 금액 조회
   */
  async getMeoguHoldByUserPhone(phone: string): Promise<Account[]> {
    const user: User | undefined = await this.userRepository.getUserByPhone(phone);
    if (user === undefined) {
      throw new NotFoundException('해당 전화번호를 가진 유저가 없습니다.');
    }

    const account: Account[] = await this.accountRepository.getMeoguHoldByUserId(user.id);

    return account;
  }


  /**
  * @description 타은행 본인 계좌 보유 금액 가져오기
  */


}
