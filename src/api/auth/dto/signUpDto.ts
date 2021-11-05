import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickname!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(7)
  @IsString()
  birth!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profileImage!: string;
}
