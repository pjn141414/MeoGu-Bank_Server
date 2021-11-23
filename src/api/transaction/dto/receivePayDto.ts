import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export default class ReceivePayDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sendAccountNum!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  receiveAccountNum!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  receivePay!: number;
}