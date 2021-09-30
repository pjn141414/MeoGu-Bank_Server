import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EasyPassword from 'src/models/easyPassword';
import User from 'src/models/User';
import EasyLoginDto from './dto/easyLoginDto';
import EasyLoginSignUpDto from './dto/easyLoginSignUpDto';
import SignInDto from './dto/signInDto';
import SignUpDto from './dto/signUpDto';
import EasyPasswordRepository from './repositories/easyPassword.repository';
import userRepository from './repositories/user.repository';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: userRepository,
    @InjectRepository(EasyPassword)
    private readonly easyPasswordRepository: EasyPasswordRepository,
  ) { }

  /**
   * @description id 중복 체크
   */
  async existIdCheck(id: string): Promise<boolean> {
    const checkId: User | undefined = await this.userRepository.existCheckId(id);
    if (checkId === undefined) {
      return false;
    }

    return true;
  }

  /**
   * @description 비밀번호 중복 체크
   */
  async existPwCheck(password: string): Promise<boolean> {
    const checkPw: User | undefined = await this.userRepository.existChckPassword(password);
    if (checkPw === undefined) {
      return false;
    }

    return true;
  }

  /**
   * @description 간편 비밀번호 중복 체크
   */
  async existEasyPwCheck(easyPassword: number): Promise<boolean> {
    const checkEasyPw: EasyPassword | undefined = await this.easyPasswordRepository.existCheckEasyPw(easyPassword);
    if (checkEasyPw === undefined) {
      return false;
    }

    return true;
  }

  /**
   * @description 일반 회원가입
   * @todo 비밀번호 암호화 및 특수문자 체크
   */
  async signUp(signUpDto: SignUpDto): Promise<void> {
    try {
      const user: User | undefined = await this.userRepository.findUserByPhone(signUpDto.phone);
      if (user !== undefined) {
        throw new ConflictException('이미 존재하는 아이디입니다.');
      }

      await this.userRepository.save(signUpDto);

    } catch (error) {
      throw new InternalServerErrorException('서버 오류');
    }
  }

  /**
  * @description 일반 로그인
  */
  async signIn(signInDto: SignInDto): Promise<User> {
    try {
      const user: User | undefined = await this.userRepository.findUserByIdAndPassword(signInDto.id, signInDto.password);
      if (user === undefined) {
        throw new NotFoundException('아이디 또는 비밀번호가 틀렸습니다.');
      }

      return user;

    } catch (error) {
      throw new InternalServerErrorException('서버 오류');
    }
  }

  /**
  * @description 간편 비밀번호 등록
  * @todo 간편 비밀번호 암호화
  */
  async easyLoginSignUp(user: User, easyLoginSignUpDto: EasyLoginSignUpDto): Promise<EasyPassword | undefined> {
    try {
      const { easyPassword }: { easyPassword: number } = easyLoginSignUpDto;

      return this.easyPasswordRepository.save({
        user,
        easyPassword,
      })

    } catch (error) {
      throw new InternalServerErrorException('서버 오류');
    }
  }

  /**
   * @description 간편 로그인
   */
  async easyLogin(easyLoginDto: EasyLoginDto): Promise<EasyPassword> {
    try {
      const { id, easyPassword }: { id: string, easyPassword: number } = easyLoginDto;

      const easyLogin: EasyPassword | undefined = await this.easyPasswordRepository
        .findUserByIdAndEasyPassword(
          id,
          easyPassword,
        )

      if (easyLogin === undefined) {
        throw new NotFoundException('없는 유저 또는 틀린 간편 비밀번호입니다.');
      }

      return easyLogin;

    } catch (error) {
      throw new InternalServerErrorException('서버 오류');
    }
  }
}
