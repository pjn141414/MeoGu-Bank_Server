import { ApiProperty } from "@nestjs/swagger";

export class SignInResponseData {
  @ApiProperty()
  public token: string;

  @ApiProperty()
  public easyPwIdx: string;
}

export class EasyLoginResponseData {
  @ApiProperty()
  public token: string;
}