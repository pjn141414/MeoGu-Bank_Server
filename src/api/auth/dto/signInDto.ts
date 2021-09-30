import { IsNotEmpty, IsString } from "class-validator";

export default class SignInDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}