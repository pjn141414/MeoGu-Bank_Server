import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateToken } from 'src/lib/token/tokenLib';
import EasyPassword from 'src/models/easyPassword';
import User from 'src/models/User';
import EasyLoginDto from './dto/easyLoginDto';
import EasyLoginSignUpDto from './dto/easyLoginSignUpDto';
import SignUpDto from './dto/signUpDto';
import EasyPasswordRepository from './repositories/easyPassword.repository';
import userRepository from './repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
import SignInDto from './dto/signInDto';
import { ILogin } from 'src/interfaces/login.interface';
import IEasyLogin from 'src/interfaces/easyLogin.interface';

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

    const regex = /^\d{3}-\d{3,4}-\d{4}$/;
    const user: User | undefined = await this.userRepository.getUserByPhone(phone);
    if (user !== undefined) {
      throw new ConflictException('이미 해당 전화번호로 가입한 유저가 있습니다.');
    }
    if (regex.test(user.phone)) {
      throw new BadRequestException('전화번호 양식에 맞지 않습니다.');
    }

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
    const easyPwUser = await this.easyPasswordRepository.getUserById(user.id);
    if (easyPwUser !== undefined) {
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

    const user: EasyPassword | undefined = await this.easyPasswordRepository.getUserById(userId);
    if (user === undefined) {
      throw new NotFoundException('유저가 없습니다.');
    }

    if (easyPassword.length != 6) {
      throw new BadRequestException('간편 비밀번호는 6자리만 가능합니다.');
    }

    const easyPw: EasyPassword | undefined = await this.easyPasswordRepository.getUserByIdAndEasyPassword(user.userId, easyPassword);
    if (easyPw.easyPassword !== undefined) {
      throw new ConflictException('간편 비밀번호 생성은 1회만 가능합니다.');
    }

    const userIdx: string = uuidv4();

    return this.easyPasswordRepository.save({
      easyLoginSignUpDto,
      idx: userIdx,
    });
  }

  /**
   * @description 간편 로그인
   */
  async easyLogin(easyLoginDto: EasyLoginDto): Promise<IEasyLogin> {
    const { idx, easyPassword }: { idx: string, easyPassword: string } = easyLoginDto;
    const user: EasyPassword | undefined = await this.easyPasswordRepository.getUserByIdx(idx);
    if (user === undefined) {
      throw new NotFoundException('없는 유저입니다.');
    }

    const easyLogin: EasyPassword | undefined = await this.easyPasswordRepository.getUserByIdxAndEasyPassword(user.idx, easyPassword);
    if (easyLogin === undefined) {
      throw new NotFoundException('없는 유저이거나 틀린 간편 비밀번호 입니다.');
    }

    const token = generateToken(user.userId);

    return {
      token,
      easyLogin,
    };
  }
}
