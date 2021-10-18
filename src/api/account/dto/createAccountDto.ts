import { IsNotEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity('account')
export default class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}