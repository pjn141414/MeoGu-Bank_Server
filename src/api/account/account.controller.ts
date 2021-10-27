import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Token } from 'src/lib/token/tokenDeco';
import AuthGuard from 'src/middleware/auth.middleware';
import Account from 'src/models/account';
import User from 'src/models/User';
import { AccountService } from './account.service';
import AddAccountDto from './dto/addAccountDto';
import CreateAccountDto from './dto/createAccountDto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) { }

  @Get('/find')
  @HttpCode(200)
  async getAccounts() {
    const account: Account[] = await this.accountService.getAccounts();

    return {
      status: 200,
      message: '계좌 전체 조회 성공',
      data: {
        account,
      },
    };
  }

  @Get('/find/other')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  async getOtherAccountsByUserPhone(@Token() user: User) {
    const account = await this.accountService.getOtherAccountsByUserPhone(user);

    return {
      status: 200,
      message: '전화번호로 해당 유저의 타은행 계좌 조회 성공',
      data: {
        account,
      },
    };
  }

  @Get('/find/:phone')
  @HttpCode(200)
  async getAccountsByUserPhone(@Param('phone') userPhone: string) {
    const account: Account[] = await this.accountService.getAccountsByUserPhone(userPhone);

    return {
      status: 200,
      message: '전화번호로 해당 유저의 자은행 계좌 조회 성공',
      data: {
        account,
      },
    };
  }

  @Post('/')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  async createAccount(@Token() user: User, @Body() createAccountDto: CreateAccountDto) {
    const account: string = await this.accountService.createAccount(user, createAccountDto);

    return {
      status: 200,
      message: '계좌 개설 성공',
      data: {
        account,
      }
    };
  }

  @Post('/add')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  async addAccount(@Token() user: User, @Body() addAccountDto: AddAccountDto) {
    const account: string = await this.accountService.addAccount(user, addAccountDto);

    return {
      status: 200,
      message: '계좌 추가 성공',
      data: {
        account,
      }
    };
  }

  @Get('/hold/bank')
  @HttpCode(200)
  async getMeoguHold() {
    const pay: Account[] = await this.accountService.getMeoguHold();

    return {
      status: 200,
      message: '자은행 총 보유 금액 조회 성공',
      data: {
        pay,
      },
    };
  }

  @Get('/hold/bank/:phone')
  @HttpCode(200)
  async getMeoguHoldByUserPhone(@Param('phone') phone: string) {
    const pay: Account[] = await this.accountService.getMeoguHoldByUserPhone(phone);

    return {
      status: 200,
      message: '자은행 고객별 총 보유 금액 조회 성공',
      data: {
        pay,
      },
    };
  }


}
