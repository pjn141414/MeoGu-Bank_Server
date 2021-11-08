import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity('account')
export default class ReceivePayInOther {
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
  @IsString()
  receiveAccountPw!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  transactionPay!: number;
}