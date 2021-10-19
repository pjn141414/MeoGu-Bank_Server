import { IsNotEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity('account')
export default class AddAccountDto {
  @IsNotEmpty()
  @IsString()
  password!: string;
}