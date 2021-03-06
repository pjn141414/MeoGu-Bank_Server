import { BadRequestException, ConflictException, Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import axios from 'axios';
import { IAddAccount } from 'src/interfaces/account/addAccount.interface';
import { ICreateAccount } from 'src/interfaces/account/createAccount.interface';
import { IGetAccount } from 'src/interfaces/account/getAccount.interface';
import { AccountEnum } from 'src/lib/enum/account';
import { EndPoints } from 'src/lib/enum/endPoints';
import hashPassword from 'src/lib/util/hashPassword';
import uuid from 'src/lib/uuid/uuid';
import Account from 'src/models/account';
import User from 'src/models/User';
import UserRepository from '../user/repositories/user.repository';
import AddAccountDto from './dto/addAccountDto';
import CheckAccountNumAndPwDto from './dto/checkAccountNumAndPwDto';
import CreateAccountDto from './dto/createAccountDto';
import ReceivePayInOtherDto from './dto/receivePayInOtherDto';
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
  async getAccountByAccountNum(accountNum: string): Promise<IGetAccount> {
    const account: Account | undefined = await this.accountRepository.getAccountByAccountNum(accountNum);
    if (account === undefined) {
      throw new NotFoundException('없는 계좌입니다.');
    }

    return {
      accountNum: account.accountNum,
      name: account.name,
    };
  }

  /**
   * @description 계좌번호로 특정 자은행 계좌, 비밀번호 확인
   */
  async checkAccountNumAndPw(checkAccountNumAndPwDto: CheckAccountNumAndPwDto): Promise<boolean> {
    const { accountNum, accountPw }: { accountNum: string, accountPw: string } = checkAccountNumAndPwDto;
    const account: Account | undefined = await this.accountRepository.getAccountByAccountNum(accountNum);
    if (account === undefined) {
      throw new NotFoundException('없는 계좌입니다.');
    }

    const password: string | undefined = account.password;
    if (accountPw !== password) {
      throw new BadRequestException('올바르지 않은 계좌 비밀번호입니다.');
    }

    return true;
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
   * @description 전화번호로 계좌 조회 API 외부 서버 axios
   */
  async Kakao_SC(userPhone: string): Promise<any> {
    const account = await axios.get(`${EndPoints.SC}/communication/${userPhone}`);

    return account.data;
  }

  async Toss_SD(userPhone: string): Promise<any> {
    let phone = Number(userPhone);
    const account = await axios.get(`${EndPoints.SD}/account/0${phone}`);

    return account.data;
  }

  async KBank_JW(userPhone: string): Promise<any> {
    const account = await axios.get(`${EndPoints.JW}/api/open/accounts/${userPhone}`);

    return account.data;
  }

  /**
   * @description 유저 전화번호로 해당 유저의 타은행 계좌 조회
   */
  async getOtherAccountsByUserPhone(user: User): Promise<any> {
    const userPhone: User | undefined = await this.userRepository.getUserByPhone(user.phone);
    const phone = userPhone.phone;
    if (phone === undefined) {
      throw new NotFoundException('해당 전화번호를 가진 유저가 없습니다.');
    }

    const account = await axios.all([this.Kakao_SC(phone), this.Toss_SD(phone), this.KBank_JW(phone)]);

    return account;
  }

  /**
   * @description 계좌 개설
   */
  async createAccount(user: User, createAccountDto: CreateAccountDto): Promise<ICreateAccount> {
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

    return {
      accountNum: account.accountNum,
    };
  }

  /**
  * @description 계좌 추가
  */
  async addAccount(user: User, addAccountDto: AddAccountDto): Promise<IAddAccount> {
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

    return {
      accountNum: account.accountNum,
    };
  }

  /**
   * @description 타은행 계좌번호로 계좌 조회 API 외부 서버 axios 
   */
  async R_Kakao_SC(accountNum: string): Promise<any> {
    const account: any = await axios.get(`${EndPoints.SC}/communication/check/accountNum/${accountNum}`);

    return account.data;
  }

  /**
   * @description 타은행 계좌번호, 비밀번호 확인 API 외부 서버 axios 
   */
  async Check_Kakao_SC(accountNum: string, accountPw: string): Promise<any> {
    const account: any = await axios.get(`${EndPoints.SC}/communication/check/accountPw/`,
      {
        params: {
          "accountNum": accountNum,
          "password": accountPw,
        }
      });

    return account.data;
  }

  /**
   * @description 추가된 계좌 내에서 다른 내 계좌로 보유 금액 가져오기
   */
  async receivePayToOther(receivePayInOtherDto: ReceivePayInOtherDto): Promise<number> {
    const { sendAccountNum, receiveAccountNum, receiveAccountPw, transactionPay }:
      { sendAccountNum: string, receiveAccountNum: string, receiveAccountPw: string, transactionPay: number } = receivePayInOtherDto;

    const sendAccount: Account = await this.accountRepository.getAccountByAccountNum(sendAccountNum);
    if (sendAccount === undefined) {
      throw new NotFoundException('추가 되어 있지 않은 계좌입니다.');
    }

    const receiveAccount: Account = await this.accountRepository.getAccountByAccountNum(receiveAccountNum);
    if (receiveAccount === undefined) {
      throw new NotFoundException('없는 계좌입니다.');
    }

    const regex = /^[0-9]{4}$/;
    if (!regex.test(receiveAccountPw)) {
      throw new BadRequestException('계좌 비밀번호는 숫자 4자리만 가능합니다.');
    }

    const checkPassword: string = receiveAccount.password;
    const hashPw = hashPassword(receiveAccountPw);

    // @todo pw 부분과 pay 부분의 switch문 합치기
    const bankCode: string = receiveAccountNum.slice(0, 3)
    switch (bankCode) {
      case AccountEnum.JN:
        if (receiveAccountPw !== checkPassword) {
          throw new BadRequestException('틀린 계좌 비밀번호입니다.');
        }



        break;
      case AccountEnum.SC:
        if (receiveAccountPw !== checkPassword) {
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

    switch (bankCode) {
      case AccountEnum.JN:
        let pay: number = sendAccount.pay;
        if (transactionPay > pay || pay <= 0) {
          throw new ConflictException('타계좌 보유 금액보다 가져오려는 금액이 더 큽니다.');
        }

        const afterSend = pay - transactionPay;
        pay = afterSend;



        break;

      case AccountEnum.SC:
        const SC_account: any = this.R_Kakao_SC(receiveAccountNum);
        let SC_pay: number = SC_account.pay;
        if (transactionPay > SC_pay || SC_pay <= 0) {
          throw new ConflictException('타계좌 보유 금액보다 가져오려는 금액이 더 큽니다.');
        }

        SC_pay -= transactionPay;
        axios.put(SC_account, SC_pay);

        await this.accountRepository.save({ pay: SC_pay });

        break;

      case AccountEnum.SD:
        break;

      case AccountEnum.JW:
        break;
    }

    return;
  }

  /**
  * @description 자은행 총 보유 금액 조회
  */
  async getMeoguHold(): Promise<Account> {
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
}