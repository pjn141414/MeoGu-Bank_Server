import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import User from 'src/models/User';
import CheckUserDto from './dto/checkUserDto';
import UserRepository from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  /**
   * @description 본인 인증
   */
  async checkUser(user: User, checkUserDto: CheckUserDto): Promise<boolean> {
    const { name, birth }: { name: string, birth: string } = checkUserDto;

    const phone = await this.userRepository.getUserByPhone(user.phone);

    if (phone.name !== name) {
      throw new BadRequestException('올바르지 않은 유저의 이름입니다.');
    }

    if (phone.birth !== birth) {
      throw new BadRequestException('올바르지 않은 유저의 생년월일입니다.');
    }

    return true;
  }

  /**
   * @description 자은행 유저 검색
   */
}
