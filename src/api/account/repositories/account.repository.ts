import Account from "src/models/account";
import { AccountEnum } from "src/lib/enum/account";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account> {
  public getAccounts(): Promise<Account[]> {
    return this.createQueryBuilder()
      .orderBy('fk_user_id', 'ASC')
      .getMany()
  }

  public getAccountsByUserId(userId: string): Promise<Account[]> {
    return this.createQueryBuilder()
      .where('account_num like :accountNum', { accountNum: `${AccountEnum.JN}%` })
      .andWhere('fk_user_id = :userId', { userId: userId })
      .getMany();
  }

  public getAccountByAccountNum(accountNum: string): Promise<Account | undefined> {
    return this.createQueryBuilder()
      .where('account_num = :accountNum', { accountNum })
      .getOne();
  }

  public getMeoguHold(): Promise<Account[]> {
    return this.createQueryBuilder()
      .select('SUM(pay)', 'sum')
      .where('account_num like :accountNum', { accountNum: `${AccountEnum.JN}%` })
      .getRawOne();
  }

  public getMeoguHoldByUserId(userId: string): Promise<Account[]> {
    return this.createQueryBuilder()
      .select('SUM(pay)', 'sum')
      .where('fk_user_id = :userId', { userId })
      .andWhere('account_num like :accountNum', { accountNum: `${AccountEnum.JN}%` })
      .getRawOne();
  }
}