import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity('account')
export default class AddAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNum!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pay!: number;
}