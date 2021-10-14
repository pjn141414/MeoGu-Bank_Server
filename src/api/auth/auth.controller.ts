import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import User from 'src/models/User';
import { AuthService } from './auth.service';
import SignUpDto from './dto/signUpDto';
import * as tokenLib from 'src/lib/token/tokenLib';
import SignInDto from './dto/signInDto';
import { ILogin } from 'src/interfaces/login.interface';
import EasyLoginSignUpDto from './dto/easyLoginSignUpDto';
import EasyPassword from 'src/models/easyPassword';
import EasyLoginDto from './dto/easyLoginDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Get('/signup/check/:id')
  @HttpCode(200)
  async existCheckId(@Query() signUpDto: SignUpDto) {
    const { id }: { id: string } = signUpDto;
    const user: boolean = await this.authService.existIdCheck(id);

    return {
      status: 200,
      message: '아이디 중복 체크 성공',
      data: {
        user,
      }
    };
  }

  @Get('/signup/check/:easyPassword')
  @HttpCode(200)
  async checkPwForm(@Query() signUpDto: SignUpDto) {
    const { password }: { password: string } = signUpDto;
    const easyPassword: boolean = await this.authService.checkPwForm(password);

    return {
      status: 200,
      message: '비밀번호 양식 체크 성공',
      data: {
        easyPassword,
      }
    };
  }

  @Post('/signup')
  @HttpCode(200)
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);

    return {
      status: 200,
      message: '일반 회원가입 성공',
    };
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    await this.authService.signIn(signInDto);

    return {
      status: 200,
      message: '로그인 성공',
    };
  }

  @Post('/signup/easy')
  @HttpCode(200)
  async easyLoginSignUp(@Body() easyLoginSignUpDto: EasyLoginSignUpDto) {
    await this.authService.easyLoginSignUp(easyLoginSignUpDto);

    return {
      status: 200,
      message: '간편 비밀번호 생성 성공',
    };
  }

  @Post('/signin/easy')
  @HttpCode(200)
  async easyLogin(@Body() easyLoginDto: EasyLoginDto) {
    await this.authService.easyLogin(easyLoginDto);

    return {
      status: 200,
      message: '간편 로그인 성공',
    };
  }
}
