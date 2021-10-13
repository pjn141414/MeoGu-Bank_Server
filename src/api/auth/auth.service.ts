import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateToken } from 'src/lib/token/tokenLib';
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
   * @description 유저 전체 조회
   */
  async getUsers(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }

  /**
   * @desciprtion id로 특정 유저 조회
   */
  async getUserById(id: string): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.getUserById(id);
    if (user === undefined) {
      throw new NotFoundException('유저가 없습니다.');
    }

    return user;
  }

  /**
   * @description 전화번호로 특정 유저 조회
   */
  async getUserByPhone(phone: string): Promise<User | undefined> {
    const user: User | undefined = await this.userRepository.getUserByPhone(phone);
    if (user !== undefined) {
      throw new ConflictException('이미 해당 전화번호로 가입한 유저가 있습니다.');
    }

    return user;
  }

  /**
   * @description id 중복 체크
   */
  async existIdCheck(userId: string): Promise<boolean> {
    const checkId: User | undefined = await this.userRepository.existCheckId(userId);
    if (checkId !== undefined) {
      throw new ConflictException('다른 id를 입력해 주세요.');
    }

    return true;
  }

  /**
   * @description 비밀번호 양식 체크
   */
  async checkPwForm(password: string): Promise<boolean> {

    if (password.length < 8 || password.length > 12) {
      throw new BadRequestException('비밀번호는 8~12자리여야 합니다.');
    }

    const regex = /^[~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]{8, 12}+$/g;

    if (regex.test(password)) {
      throw new BadRequestException('비밀번호는 영어+영문+특수문자(1자 이상)여야 합니다.');
    }

    return true;
  }

  /**
   * @description 일반 회원가입
   * @todo 비밀번호 암호화 및 특수문자 체크
   */
  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { phone }: { id: string, phone: string } = signUpDto;

    const user: User | undefined = await this.getUserByPhone(phone);
    if (user !== undefined) {
      throw new ConflictException('이미 해당 전화번호로 가입한 유저가 있습니다.');
    }

    await this.userRepository.save(signUpDto);
  }

  /**
   * @description 일반 로그인
   */
  async signIn(signInDto: SignInDto): Promise<string> {
    const { id, password }: { id: string, password: string } = signInDto;

    const user: User | undefined = await this.userRepository.getUserByIdAndPassword(id, password);
    if (user === undefined) {
      throw new NotFoundException('아이디 또는 비밀번호가 틀렸습니다.');
    }

    return generateToken(user.id);
  }

  /**
   * @description 간편 비밀번호 등록
   * @todo 간편 비밀번호 암호화
   */
  async easyLoginSignUp(user: User, easyLoginSignUpDto: EasyLoginSignUpDto): Promise<EasyPassword | undefined> {
    const { id }: { id: string } = user;
    const { easyPassword }: { easyPassword: string } = easyLoginSignUpDto;
    if (easyPassword.length != 6) {
      throw new BadRequestException('간편 비밀번호는 6자리만 가능합니다.');
    }

    const userId: EasyPassword | undefined = await this.easyPasswordRepository.getUserById(id);
    if (userId === undefined) {
      throw new NotFoundException('유저가 없습니다.');
    }

    const easyPw: EasyPassword | undefined = await this.easyPasswordRepository.getUserByIdAndEasyPassword(id, easyPassword);
    if (easyPw.easyPassword !== undefined) {
      throw new ConflictException('간편 비밀번호 생성은 1회만 가능합니다.');
    }

    return this.easyPasswordRepository.save({
      user,
      easyLoginSignUpDto
    });
  }

  /**
   * @description 간편 로그인
   */
  async easyLogin(easyLoginDto: EasyLoginDto): Promise<EasyPassword> {
    const { idx, easyPassword }: { idx: number; easyPassword: string } = easyLoginDto;

    const easyLogin: EasyPassword | undefined = await this.easyPasswordRepository.getUserByIdAndEasyPassword(
      idx, easyPassword
    );

    if (easyLogin === undefined) {
      throw new NotFoundException('없는 유저 또는 틀린 간편 비밀번호입니다.');
    }

    return easyLogin;
  }
}
