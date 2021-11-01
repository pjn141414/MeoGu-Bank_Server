import { IsNotEmpty, IsString } from "class-validator";

export default class SendPayDto {
  @IsNotEmpty()
  @IsString()

}