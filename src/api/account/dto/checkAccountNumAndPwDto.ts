import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity('account')
export default class CheckAccountNumAndPwDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNum!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountPw!: string;
}