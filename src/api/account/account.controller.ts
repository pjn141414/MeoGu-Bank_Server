import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IAddAccount } from 'src/interfaces/account/addAccount.interface';
import { ICreateAccount } from 'src/interfaces/account/createAccount.interface';
import { IGetAccount } from 'src/interfaces/account/getAccount.interface';
import BaseReponse from 'src/lib/response/base.reponse';
import { Token } from 'src/lib/token/tokenDeco';
import AuthGuard from 'src/middleware/auth.middleware';
import Account from 'src/models/account';
import User from 'src/models/User';
import { AccountService } from './account.service';
import AddAccountDto from './dto/addAccountDto';
import CheckAccountNumAndPwDto from './dto/checkAccountNumAndPwDto';
import CreateAccountDto from './dto/createAccountDto';
import CreateAccountResponse, { AddAccountReponse, GetAccountByAccountNumResponse, GetMeoguHoldResponse, AccountArrayResponse } from './responses/account.response';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) { }

  @Get('/find')
  @HttpCode(200)
  @ApiOperation({ summary: '계좌 전체 조회 API / Try it out 해보세요', description: '계좌 전체 조회' })
  @ApiOkResponse({ description: '계좌 전체 조회 성공', type: AccountArrayResponse })
  async getAccounts() {
    const accounts: Account[] = await this.accountService.getAccounts();

    return new AccountArrayResponse(200, '계좌 전체 조회 성공', accounts);
  }

  @Get('/find/other')
  @HttpCode(200)
  @ApiOperation({ summary: '유저 전화번호로 해당 유저의 타은행 계좌 조회 API / 안되면 다른 서버가 안 켜져있는 겁니다.', description: '유저 전화번호로 해당 유저의 타은행 계좌 조회' })
  @ApiOkResponse({ description: '유저 전화번호로 해당 유저의 타은행 계좌 조회 성공', type: AccountArrayResponse })
  @UseGuards(new AuthGuard())
  async getOtherAccountsByUserPhone(@Token() user: User) {
    const account = await this.accountService.getOtherAccountsByUserPhone(user);

    return new AccountArrayResponse(200, '유저 전화번호로 해당 유저의 타은행 계좌 조회 성공', account);
  }

  @Get('find/account')
  @HttpCode(200)
  @ApiOperation({ summary: '계좌번호로 특정 머구은행 계좌번호, 비밀번호 조회 API', description: '계좌번호로 특정 머구은행 계좌번호, 비밀번호 조회' })
  @ApiOkResponse({ description: '계좌번호로 특정 머구은행 계좌번호, 비밀번호 조회 성공', type: BaseReponse })
  @ApiBadRequestResponse({ description: '올바르지 않은 계좌 비밀번호입니다.' })
  @ApiNotFoundResponse({ description: '없는 계좌입니다.' })
  async checkAccountNumAndPw(@Body() checkAccountNumAndPwDto: CheckAccountNumAndPwDto) {
    const account: boolean = await this.accountService.checkAccountNumAndPw(checkAccountNumAndPwDto);

    return new BaseReponse(200, '계좌번호로 특정 머구은행 계좌번호, 비밀번호 조회 성공', account);
  }

  @Get('find/account/:account')
  @HttpCode(200)
  @ApiOperation({ summary: '계좌번호로 특정 머구은행 계좌 조회 API', description: '계좌 개설 / 리퀘스트 이름, 비번은 모두 통장 이름 및 통장 비번입니다.' })
  @ApiOkResponse({ description: '계좌번호로 특정 머구은행 계좌 조회 성공', type: GetAccountByAccountNumResponse })
  @ApiNotFoundResponse({ description: '없는 계좌입니다.' })
  async getAccountsByAccountNum(@Param('account') accountNum: string) {
    const account: IGetAccount = await this.accountService.getAccountByAccountNum(accountNum);

    return new GetAccountByAccountNumResponse(200, '계좌번호로 특정 머구은행 계좌 조회 성공', account);
  }

  @Get('/find/phone/:phone')
  @HttpCode(200)
  @ApiOperation({ summary: '전화번호로 해당 유저의 머구은행 계좌 조회 API', description: '계좌 개설 / 리퀘스트 이름, 비번은 모두 통장 이름 및 통장 비번입니다.' })
  @ApiOkResponse({ description: '전화번호로 해당 유저의 머구은행 계좌 조회 성공', type: AccountArrayResponse })
  @ApiNotFoundResponse({ description: '해당 전화번호로 가진 유저가 없습니다.' })
  async getAccountsByUserPhone(@Param('phone') userPhone: string) {
    const accounts: Account[] = await this.accountService.getAccountsByUserPhone(userPhone);

    return new AccountArrayResponse(200, '전화번호로 해당 유저의 머구은행 계좌 조회 성공', accounts);
  }

  @Post('/')
  @HttpCode(200)
  @ApiOperation({ summary: '계좌 개설 API', description: '계좌 개설 / 리퀘스트 이름, 비번은 모두 통장 이름 및 통장 비번입니다.' })
  @ApiOkResponse({ description: '계좌 개설 성공', type: CreateAccountResponse })
  @ApiBadRequestResponse({ description: '계좌 비밀번호는 숫자 4자리만 가능합니다.' })
  @UseGuards(new AuthGuard())
  async createAccount(@Token() user: User, @Body() createAccountDto: CreateAccountDto) {
    const account: ICreateAccount = await this.accountService.createAccount(user, createAccountDto);

    return new CreateAccountResponse(200, '계좌 개설 성공', account);
  }

  @Post('/add')
  @HttpCode(200)
  @ApiOperation({ summary: '계좌 추가 API', description: '계좌 추가 / 리퀘스트 이름, 비번은 모두 통장 이름 및 통장 비번입니다.' })
  @ApiOkResponse({ description: '계좌 추가 성공', type: AddAccountReponse })
  @ApiBadRequestResponse({ description: '올바르지 않은 계좌번호입니다.' })
  @ApiNotFoundResponse({ description: '해당 전화번호를 가진 유저가 없습니다.' })

  @UseGuards(new AuthGuard())
  async addAccount(@Token() user: User, @Body() addAccountDto: AddAccountDto) {
    const account: IAddAccount = await this.accountService.addAccount(user, addAccountDto);

    return new AddAccountReponse(200, '계좌 추가 성공', account);
  }

  @Get('/hold/bank')
  @HttpCode(200)
  @ApiOperation({ summary: '자은행 총 보유 금액 조회 API', description: '자은행 총 보유 금액 조회' })
  @ApiOkResponse({ description: '자은행 총 보유 금액 조회 성공', type: GetMeoguHoldResponse })
  async getMeoguHold() {
    const pay: Account = await this.accountService.getMeoguHold();

    return new GetMeoguHoldResponse(200, '자은행 총 보유 금액 조회 성공', pay);
  }

  @Get('/hold/bank/:phone')
  @HttpCode(200)
  @ApiOperation({ summary: '자은행 고객별 총 보유 금액 조회 API', description: '계좌 개설 / 리퀘스트 이름, 비번은 모두 통장 이름 및 통장 비번입니다.' })
  @ApiOkResponse({ description: '자은행 고객별 총 보유 금액 조회 성공', type: AccountArrayResponse })
  @ApiNotFoundResponse({ description: '해당 전화번호로 가진 유저가 없습니다.' })
  async getMeoguHoldByUserPhone(@Param('phone') phone: string) {
    const pay: Account[] = await this.accountService.getMeoguHoldByUserPhone(phone);

    return new AccountArrayResponse(200, '자은행 고객별 총 보유 금액 조회 성공', pay);
  };
}
