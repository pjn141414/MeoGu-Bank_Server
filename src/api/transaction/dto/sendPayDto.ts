import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export default class SendPayDto {
  @IsNotEmpty()
  @IsString()
  sendAccountNum!: string;

  @IsNotEmpty()
  @IsString()
  sendAccountPw!: string;

  @IsNotEmpty()
  @IsString()
  receiveAccountNum!: string;

  @IsNotEmpty()
  @IsNumber()
  pay!: number;
}