import User from "src/models/User";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export default class userRepository extends Repository<User> {
  public existCheckId(id: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .where('id =: id', { id })
      .getOne()
  }

  public existChckPassword(password: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .where('password =: password', { password })
      .getOne();
  }

  public findUserByIdAndPassword(id: string, password: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .where('id =: id', { id })
      .andWhere('password =: password', { password })
      .getOne()
  }

  public findUserByPhone(phone: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .where('phone =: phone', { phone })
      .getOne()
  }
}