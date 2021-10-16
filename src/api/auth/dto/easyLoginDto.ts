import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export default class EasyLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  idx!: string;

  @IsNotEmpty()
  @Length(6)
  @IsString()
  easyPassword!: string;
}