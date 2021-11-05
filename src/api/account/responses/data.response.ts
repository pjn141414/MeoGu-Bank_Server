import { ApiProperty } from "@nestjs/swagger";
import Account from "src/models/account";

export class CreateAccountData {
  @ApiProperty()
  public accountNum: string;
}

export class AddAccountData {
  @ApiProperty()
  public accountNum: string;
}

export class GetAccountByAccountNumData {
  @ApiProperty()
  public accountNum: string;

  @ApiProperty()
  public name: string;
}

export class GetAccountsData {
  @ApiProperty()
  public pay: number;
}