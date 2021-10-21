import { Body, Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Token } from 'src/lib/token/tokenDeco';
import AuthGuard from 'src/middleware/auth.middleware';
import User from 'src/models/User';
import CheckUserDto from './dto/checkUserDto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get('/check')
  @HttpCode(200)
  @UseGuards(new AuthGuard())
  async checkUser(@Token() user: User, @Body() checkUserDto: CheckUserDto) {
    await this.userService.checkUser(user, checkUserDto);

    return {
      status: 200,
      message: '본인 인증 성공',
    };
  }
}
