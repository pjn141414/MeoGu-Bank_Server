import Account from "src/models/account";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Account)
export default class TransactionRepository extends Repository<Account> {

}