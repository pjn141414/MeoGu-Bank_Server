import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export default class EasyLoginSignUpDto {
  @IsNotEmpty()
  @Min(6, {
    message: '간편 비밀번호는 6자리만 가능합니다.',
  })
  @Max(6, {
    message: '간편 비밀번호는 6자리만 가능합니다',
  })
  @IsNumber()
  easyPassword!: number;
}