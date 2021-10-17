import { Controller, UseGuards } from '@nestjs/common';
import { Token } from 'src/lib/token/tokenDeco';
import AuthGuard from 'src/middleware/auth.middleware';
import User from 'src/models/User';

@Controller('user')
export class UserController {
  constructor(

  ) { }

  @UseGuards(new AuthGuard())
  async test(@Token() user: User) {

  }
}
