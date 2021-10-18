import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Token } from 'src/lib/token/tokenDeco';
import AuthGuard from 'src/middleware/auth.middleware';
import Account from 'src/models/account';
import User from 'src/models/User';
import { AccountService } from './account.service';
import CreateAccountDto from './dto/createAccountDto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) { }

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

  @Get('/hold/bank')
  @HttpCode(200)
  async getMeoguHold() {
    const pay: Account[] = await this.accountService.getMeoguHold();

    return {
      status: 200,
      message: '자은행 총 보유 금액 조회 성공',
      data: {
        pay,
      }
    };
  }
}
