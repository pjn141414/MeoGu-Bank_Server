import { IsNotEmpty, IsString, Length } from "class-validator";

export default class EasyLoginSignUpDto {
  @IsNotEmpty()
  @Length(3, 12, {
    message: '아이디는 3자리부터 12자리까지만 가능합니다.',
  })
  @IsString()
  userId!: string

  @IsNotEmpty()
  @Length(6, 6, {
    message: '간편 비밀번호는 6자리만 가능합니다.',
  })
  @IsString()
  easyPassword!: string;
}