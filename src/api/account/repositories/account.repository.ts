import Account from "src/models/account";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account> {
  public getAccounts(): Promise<Account[]> {
    return this.createQueryBuilder()
      .orderBy('fk_user_id', 'DESC')
      .getMany()
  }

  public getAccount(accountNum: string): Promise<Account | undefined> {
    return this.createQueryBuilder()
      .where('account_num = :accountNum', { accountNum })
      .getOne();
  }

  public getMeoguHold(): Promise<Account[]> {
    return this.createQueryBuilder()
      .select('SUM(pay)', 'sum')
      .where('account_num like :accountNum', { accountNum: `${719}%` })
      .getRawOne();
  }
}