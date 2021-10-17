import { Body, Controller, Get, HttpCode } from '@nestjs/common';
import Account from 'src/models/account';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) { }

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
    }
  }
}
