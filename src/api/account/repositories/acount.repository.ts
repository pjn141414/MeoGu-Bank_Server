import Account from "src/models/account";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Account)
export default class AccountRepository extends Repository<Account> {
  public getAccounts(): Promise<Account[]> {
    return this.createQueryBuilder()
      .orderBy('create_at', 'DESC')
      .getMany()
  }
}