import { IsNotEmpty, IsString, Max, Min } from "class-validator";

export default class EasyLoginDto {
  @IsNotEmpty()
  @IsString()
  idx!: number;

  @IsNotEmpty()
  @Min(6, {
    message: '간편 비밀번호는 6자리만 가능합니다.',
  })
  @Max(6, {
    message: '간편 비밀번호는 6자리만 가능합니다',
  })
  @IsString()
  easyPassword!: string;
}