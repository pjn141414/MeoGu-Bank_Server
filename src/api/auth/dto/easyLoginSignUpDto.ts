import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export default class EasyLoginSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  easyPassword!: string;
}