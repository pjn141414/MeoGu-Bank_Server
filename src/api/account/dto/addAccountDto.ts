import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity('account')
export default class AddAccountDto {
  @IsNotEmpty()
  @IsString()
  accountNum!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsNumber()
  pay!: number;
}