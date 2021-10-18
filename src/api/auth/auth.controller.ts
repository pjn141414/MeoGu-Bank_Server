import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignUpDto from './dto/signUpDto';
import SignInDto from './dto/signInDto';
import EasyLoginSignUpDto from './dto/easyLoginSignUpDto';
import EasyLoginDto from './dto/easyLoginDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Get('/signup/check')
  @HttpCode(200)
  async existCheckId(@Query('id') id: string) {
    const user: boolean = await this.authService.existIdCheck(id);

    return {
      status: 200,
      message: '아이디 중복 체크 성공',
      data: {
        user,
      }
    };
  }

  @Post('/signup')
  @HttpCode(200)
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      await this.authService.signUp(signUpDto);

      return {
        status: 200,
        message: '일반 회원가입 성공',
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const user = await this.authService.signIn(signInDto);

      return {
        status: 200,
        message: '로그인 성공',
        data: {
          user,
        }
      };
    } catch (error) {
      throw error;
    }
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
    const easyLogin = await this.authService.easyLogin(easyLoginDto);

    return {
      status: 200,
      message: '간편 로그인 성공',
      data: {
        easyLogin,
      }
    };
  }
}
