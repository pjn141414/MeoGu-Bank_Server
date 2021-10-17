import { Injectable } from '@nestjs/common';
import Account from 'src/models/account';
import UserRepository from '../user/repositories/user.repository';
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
    return this.accountRepository.getAccounts();
  }

  /**
   * @description 특정 계좌 조회
   */
  // async getAccount(): Promise<Account | undefined> { }


  /**
   * @description 계좌 개설
   */


  /**
  * @description 계좌 추가
  */

  /**
  * @description 자은행 총 보유 금액 조회
  */
  async getMeoguHold(): Promise<Account[]> {
    return await this.accountRepository.getMeoguHold();
  }

  /**
   * @description 자은행 고객별 총 보유 금액 조회
   */


  /**
  * @description 타은행 본인 계좌 보유 금액 가져오기
  */
}
