import EasyPassword from 'src/models/easyPassword';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(EasyPassword)
export default class EasyPasswordRepository extends Repository<EasyPassword> {
  public existCheckEasyPw(easyPassword: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .where('easyPassword = :easyPassword', { easyPassword })
      .getOne();
  }

  public getUserById(userId: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder('easy_password')
      .where('fk_user_id = :userId', { userId })
      .getOne();
  }

  public getUserByIdx(idx: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .where('idx = :idx', { idx })
      .getOne();
  }

  public getUserByIdxAndEasyPassword(idx: string, easyPassword: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .where('idx = :idx', { idx })
      .andWhere('easy_password = :easyPassword', { easyPassword })
      .getOne();
  }
}