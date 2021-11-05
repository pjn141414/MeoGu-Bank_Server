import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";

export default class EasyLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  idx!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6)
  @IsString()
  easyPassword!: string;
}