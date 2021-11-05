import { ApiProperty } from "@nestjs/swagger";
import BaseReponse from "src/lib/response/base.reponse";
import Account from "src/models/account";
import { AddAccountData, CreateAccountData, GetAccountByAccountNumData, GetAccountsData } from "./data.response";

export default class CreateAccountResponse extends BaseReponse<CreateAccountData> {
  @ApiProperty()
  data: CreateAccountData;
}

export class AddAccountReponse extends BaseReponse<AddAccountData> {
  @ApiProperty()
  data: AddAccountData;
}

export class GetAccountByAccountNumResponse extends BaseReponse<GetAccountByAccountNumData> {
  @ApiProperty()
  data: GetAccountByAccountNumData;
}

export class GetMeoguHoldResponse extends BaseReponse<GetAccountsData> {
  @ApiProperty()
  data: GetAccountsData;
}

export class AccountArrayResponse extends BaseReponse<Account[]> {
  @ApiProperty({
    type: () => [Account],
  })
  data: Account[];
}