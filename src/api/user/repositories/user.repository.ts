import User from "src/models/User";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  public getUsers(): Promise<User[]> {
    return this.createQueryBuilder()
      .orderBy('id', 'DESC')
      .getMany()
  }

  public getUserById(id: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
  }

  public getUserByIdAndPassword(id: string, password: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .where('id = :id', { id })
      .andWhere('password = :password', { password })
      .getOne();
  }

  public getUserByPhone(phone: string): Promise<User | undefined> {
    return this.createQueryBuilder()
      .where('phone = :phone', { phone })
      .getOne();
  }
}