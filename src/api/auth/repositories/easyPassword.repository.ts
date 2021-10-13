import EasyPassword from 'src/models/easyPassword';
import { Repository } from 'typeorm';

export default class EasyPasswordRepository extends Repository<EasyPassword> {
  public existCheckEasyPw(easyPassword: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .where('easyPassword =: easyPassword', { easyPassword })
      .getOne();
  }

  public getUserById(userId: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .leftJoinAndSelect('easyPassword.userId', 'userId')
      .where('userId =: userId', { userId })
      .getOne();
  }

  public getUserByIdAndEasyPassword(userId: string, easyPassword: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .leftJoinAndSelect('easyPassword.userId', 'userId')
      .where('userId =: userId', { userId })
      .andWhere('easyPassword =: easyPassword', { easyPassword })
      .getOne();
  }

  public getUserByIdxAndEasyPassword(idx: number, easyPassword: string): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .where('idx =: idx', { idx })
      .andWhere('easyPassword =: easyPassword', { easyPassword })
      .getOne();
  }
}