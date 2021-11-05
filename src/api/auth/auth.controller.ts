import { Body, Controller, Get, HttpCode, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignUpDto from './dto/signUpDto';
import SignInDto from './dto/signInDto';
import EasyLoginSignUpDto from './dto/easyLoginSignUpDto';
import EasyLoginDto from './dto/easyLoginDto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import User from 'src/models/User';
import SignInResponse, { EasyLoginResponse } from './responses/auth.response.dto';
import { ILogin } from 'src/interfaces/auth/login.interface';
import BaseReponse from 'src/lib/response/base.reponse';
import IEasyLogin from 'src/interfaces/auth/easyLogin.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }


  @Get('/signup/check')
  @HttpCode(200)
  @ApiOperation({ summary: '아이디 중복 체크 API', description: '유저 아이디 중복 체크' })
  @ApiOkResponse({ description: '아이디 중복 체크 성공', type: BaseReponse })
  @ApiConflictResponse({ description: '다른 id를 입력해 주세요.' })
  async existCheckId(@Query('id') id: string) {
    await this.authService.existIdCheck(id);

    return new BaseReponse(200, '아이디 중복 체크 성공');
  }

  @Post('/signup')
  @HttpCode(200)
  @ApiOperation({ summary: '일반 회원가입 API', description: '일반 회원가입' })
  @ApiOkResponse({ description: '일반 회원가입 성공', type: BaseReponse })
  @ApiBadRequestResponse({ description: '생년월일은 주민등록번호 앞자리와 뒤 맨 앞자리(1-4/총 7자리)만 가능합니다.' })
  @ApiConflictResponse({ description: '이미 해당 아이디/전화번호로 가입한 유저가 있습니다.' })
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      await this.authService.signUp(signUpDto);

      return new BaseReponse(200, '일반 회원가입 성공');
    } catch (error) {
      throw error;
    }
  }

  @Post('/signin')
  @HttpCode(200)
  @ApiOperation({ summary: '일반 로그인 API', description: '일반 로그인' })
  @ApiOkResponse({ description: '일반 로그인 성공', type: SignInResponse })
  @ApiNotFoundResponse({ description: '아이디 또는 비밀번호가 틀렸습니다.' })
  @ApiNotFoundResponse({ description: '간편 비밀번호 설정이 되어 있지 않습니다.' })
  async signIn(@Body() signInDto: SignInDto) {
    try {
      const user: ILogin = await this.authService.signIn(signInDto);

      return new SignInResponse(200, '일반 로그인 성공', user);
    } catch (error) {
      throw error;
    }
  }

  @Post('/signup/easy')
  @HttpCode(200)
  @ApiOperation({ summary: '간편 회원가입 API', description: '간편 회원가입' })
  @ApiOkResponse({ description: '간편 회원가입 성공', type: BaseReponse })
  @ApiNotFoundResponse({ description: '유저가 없습니다.' })
  @ApiBadRequestResponse({ description: '간편 비밀번호는 숫자 6자리만 가능합니다.' })
  @ApiConflictResponse({ description: '간편 비밀번호 생성은 1회만 가능합니다.' })
  async easyLoginSignUp(@Body() easyLoginSignUpDto: EasyLoginSignUpDto) {
    await this.authService.easyLoginSignUp(easyLoginSignUpDto);

    return new BaseReponse(200, '간편 비밀번호 생성 성공');
  }

  @Post('/signin/easy')
  @HttpCode(200)
  @ApiOperation({ summary: '간편 로그인 API', description: '간편 로그인' })
  @ApiOkResponse({ description: '간편 로그인 성공', type: EasyLoginResponse })
  @ApiNotFoundResponse({ description: '없는 유저입니다.' })
  @ApiNotFoundResponse({ description: '첫 로그인은 일반 로그인이어야 합니다.' })
  @ApiNotFoundResponse({ description: '첫 로그인이 일반 로그인이 아니거나 틀린 간편 비밀번호 입니다.' })
  async easyLogin(@Body() easyLoginDto: EasyLoginDto) {
    const easyLogin: IEasyLogin = await this.authService.easyLogin(easyLoginDto);

    return new EasyLoginResponse(200, '간편 로그인 성공', easyLogin);
  }
}
