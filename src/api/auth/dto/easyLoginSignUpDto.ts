import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export default class EasyLoginSignUpDto {
  @IsNotEmpty()
  @IsString()
  userId!: string

  @IsNotEmpty()
  @IsString()
  easyPassword!: string;
}