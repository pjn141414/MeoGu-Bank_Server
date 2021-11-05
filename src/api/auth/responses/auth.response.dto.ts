import { ApiProperty } from "@nestjs/swagger";
import BaseReponse from "src/lib/response/base.reponse";
import { EasyLoginResponseData, SignInResponseData } from "./data.response";

export default class SignInResponse extends BaseReponse<SignInResponseData> {
  @ApiProperty()
  data: SignInResponseData;
}

export class EasyLoginResponse extends BaseReponse<EasyLoginResponseData> {
  @ApiProperty()
  data: EasyLoginResponseData;
}