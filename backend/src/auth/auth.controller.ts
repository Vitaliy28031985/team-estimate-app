import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { user } from 'src/interfaces/user';
import { User } from 'src/database/models/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: any): Promise<User> {
    const newUser = await this.authService.register(registerDto);
    newUser.password = undefined;
    return newUser;
  }
}
