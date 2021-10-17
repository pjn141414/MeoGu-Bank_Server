import { IsNotEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity('user')
export default class CheckUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  birth!: string;
}