import { Body, Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignUpDto from './dto/signUpDto';
import SignInDto from './dto/signInDto';
import EasyLoginSignUpDto from './dto/easyLoginSignUpDto';
import EasyLoginDto from './dto/easyLoginDto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import User from 'src/models/User';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }


  @Get('/signup/check')
  @HttpCode(200)
  @ApiOperation({ summary: '아이디 중복 체크 API', description: '유저 아이디 중복 체크' })
  @ApiOkResponse({ description: '아이디 중복 체크 성공', type: User })
  async existCheckId(@Query('id') id: string) {
    const user: boolean = await this.authService.existIdCheck(id);

    return {
      status: 200,
      message: '아이디 중복 체크 성공'
    };
  }

  @Post('/signup')
  @HttpCode(200)
  @ApiOperation({ summary: '일반 회원가입 API', description: '일반 회원가입' })
  @ApiOkResponse({ description: '일반 회원가입 성공', type: User })
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
  @ApiOperation({ summary: '일반 로그인 API', description: '일반 로그인' })
  @ApiOkResponse({ description: '일반 로그인 성공', type: SignInDto })
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
  @ApiOperation({ summary: '간편 회원가입 API', description: '간편 회원가입' })
  @ApiOkResponse({ description: '간편 회원가입 성공', type: User })
  async easyLoginSignUp(@Body() easyLoginSignUpDto: EasyLoginSignUpDto) {
    await this.authService.easyLoginSignUp(easyLoginSignUpDto);

    return {
      status: 200,
      message: '간편 비밀번호 생성 성공',
    };
  }

  @Post('/signin/easy')
  @HttpCode(200)
  @ApiOperation({ summary: '간편 로그인 API', description: '간편 로그인' })
  @ApiOkResponse({ description: '간편 로그인 성공', type: User })
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
