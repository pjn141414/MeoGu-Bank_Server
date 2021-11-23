import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import BaseReponse from 'src/lib/response/base.reponse';
import AuthGuard from 'src/middleware/auth.middleware';
import Receive from 'src/models/receive';
import ReceivePayDto from './dto/receivePayDto';
import { TransactionService } from './transaction.service';


@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
  ) { }

  @Post('/receive')
  @HttpCode(200)
  @ApiOperation({ summary: '송금 수신 API' })
  @ApiOkResponse({ description: '송금 수신 성공', type: BaseReponse })
  async receivePay(@Body() receivePayDto: ReceivePayDto) {
    const receive: Receive = await this.transactionService.receivePay(receivePayDto);

    return new BaseReponse(200, '송금 수신 성공', receive);
  }
}
