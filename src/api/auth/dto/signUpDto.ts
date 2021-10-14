import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export default class SignUpDto {
  @IsNotEmpty()
  @Length(3, 12, {
    message: '아이디는 3자리부터 12자리까지만 가능합니다.',
  })
  @IsString()
  id!: string;

  @IsNotEmpty()
  @Length(8, 12, {
    message: '비밀번호는 8자리부터 12자리까지만 가능합니다.',
  })
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  nickname!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  birth!: string;
}
