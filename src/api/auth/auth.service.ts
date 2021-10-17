import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { generateToken } from 'src/lib/token/tokenLib';
import EasyPassword from 'src/models/easyPassword';
import User from 'src/models/User';
import EasyLoginDto from './dto/easyLoginDto';
import EasyLoginSignUpDto from './dto/easyLoginSignUpDto';
import SignUpDto from './dto/signUpDto';
import EasyPasswordRepository from './repositories/easyPassword.repository';
import UserRepository from '../user/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
import SignInDto from './dto/signInDto';
import { ILogin } from 'src/interfaces/login.interface';
import IEasyLogin from 'src/interfaces/easyLogin.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
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
    const checkId: User | undefined = await this.userRepository.getUserById(userId);
    if (checkId !== undefined) {
      throw new ConflictException('다른 id를 입력해 주세요.');
    }

    return true;
  }

  /**
   * @description 아이디 양식 체크
   */
  async checkIdForm(id: string): Promise<boolean> {

    const regex = /^(?=.*\d)(?=.*[a-z]).{3,12}$/;

    if (!regex.test(id)) {
      throw new BadRequestException('아이디는 3~12자리, 영문+숫자 조합만 가능합니다.');
    }

    return false;
  }

  /**
   * @description 비밀번호 양식 체크
   */
  async checkPwForm(password: string): Promise<boolean> {

    const regex = /^(?=.*[~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-])(?=.*\d)(?=.*[a-z]).{8,12}$/;
    if (!regex.test(password)) {
      throw new BadRequestException
        ('비밀번호는 8~12자리, 영문+숫자+특수문자(1자 이상) 조합만 가능합니다.');
    }

    return false;
  }

  /**
   * @description 일반 회원가입
   * @todo 비밀번호 암호화 및 특수문자 체크
   */
  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { id, password, phone, birth }:
      { id: string, password: string, phone: string, birth: string } = signUpDto;

    const user: User | undefined = await this.userRepository.getUserByPhone(phone);
    if (user !== undefined) {
      throw new ConflictException('이미 해당 전화번호로 가입한 유저가 있습니다.');
    }

    const userId: User | undefined = await this.userRepository.getUserById(id);
    if (userId !== undefined) {
      throw new ConflictException('이미 해당 아이디로 가입한 유저가 있습니다.');
    }

    const regex = /^((?=.*\d).{6})((?=.*[1-4]).{1})$/;
    if (!regex.test(birth)) {
      throw new BadRequestException
        ('생년월일은 주민등록번호 앞자리와 뒤 맨 앞자리(1-4/총 7자리)만 가능합니다.');
    }

    await this.checkIdForm(id);

    await this.checkPwForm(password);


    await this.userRepository.create(signUpDto);
    await this.userRepository.save(signUpDto);
  }

  /**
   * @description 일반 로그인
   */
  async signIn(signInDto: SignInDto): Promise<ILogin> {
    const { id, password }: { id: string, password: string } = signInDto;
    const user: User | undefined = await this.userRepository.getUserByIdAndPassword(id, password);
    if (user === undefined) {
      throw new NotFoundException('아이디 또는 비밀번호가 틀렸습니다.');
    }

    const token = generateToken(user.id);
    const easyPwUser = await this.easyPasswordRepository.getUserById(id);
    if (easyPwUser === undefined) {
      throw new NotFoundException('간편 비밀번호 설정이 되어 있지 않습니다.');
    }
    const easyPwIdx: string = easyPwUser.idx;

    return {
      token,
      easyPwIdx,
    };
  }

  /**
   * @description 간편 비밀번호 등록
   * @todo 간편 비밀번호 암호화
   */
  async easyLoginSignUp(easyLoginSignUpDto: EasyLoginSignUpDto): Promise<EasyPassword | undefined> {
    const { userId, easyPassword }: { userId: string, easyPassword: string } = easyLoginSignUpDto;

    const user: User | undefined = await this.userRepository.getUserById(userId);
    if (user === undefined) {
      throw new NotFoundException('유저가 없습니다.');
    }

    const easyPw: EasyPassword | undefined = await this.easyPasswordRepository.getUserById(userId);
    if (easyPw !== undefined) {
      throw new ConflictException('간편 비밀번호 생성은 1회만 가능합니다.');
    }

    const regex = /^[0-9]{6}$/;
    if (!regex.test(easyPassword)) {
      throw new BadRequestException('간편 비밀번호는 숫자 6자리만 가능합니다.');
    }

    const userIdx: string = uuidv4();

    const data = this.easyPasswordRepository.create({
      user: user,
      easyPassword: easyPassword,
      idx: userIdx,
    })

    return this.easyPasswordRepository.save(data);
  }

  /**
   * @description 간편 로그인
   */
  async easyLogin(easyLoginDto: EasyLoginDto): Promise<IEasyLogin> {
    const { idx, easyPassword }: { idx: string, easyPassword: string } = easyLoginDto;
    const easyPwIdx: EasyPassword | undefined = await this.easyPasswordRepository.getUserByIdx(idx);
    if (easyPwIdx === undefined) {
      throw new NotFoundException('첫 로그인은 일반 로그인이어야 합니다.');
    }

    const user: User | undefined = await this.userRepository.getUserById(easyPwIdx.userId);
    if (user === undefined) {
      throw new NotFoundException('없는 유저입니다.');
    }

    const easyLogin: EasyPassword | undefined = await this.easyPasswordRepository.getUserByIdxAndEasyPassword(idx, easyPassword);
    if (easyLogin === undefined) {
      throw new NotFoundException('첫 로그인이 일반 로그인이 아니거나 틀린 간편 비밀번호 입니다.');
    }

    const token = generateToken(easyPwIdx.userId);

    return {
      token,
      easyLogin,
    };
  }
}
