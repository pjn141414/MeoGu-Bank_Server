import EasyPassword from "src/models/easyPassword";
import { Repository } from "typeorm";

export default class EasyPasswordRepository extends Repository<EasyPassword> {
  public existCheckEasyPw(easyPassword: number): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .where('easyPassword =: easyPassword', { easyPassword })
      .getOne()
  }

  public findUserByIdAndEasyPassword(userId: string, easyPassword: number): Promise<EasyPassword | undefined> {
    return this.createQueryBuilder()
      .where('id =: userId', { userId })
      .andWhere('easyPassword =: easyPassword', { easyPassword })
      .getOne()
  }
}