import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/mongo/schemas/user/user.schema';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
// import { user } from 'src/interfaces/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: any): Promise<User> {
    const newUser = await this.authService.register(registerDto);
    newUser.password = undefined;
    return newUser;
  }

  @Get('/verify/:verificationToken')
  async verifyUser(
    @Param('verificationToken')
    verificationToken: string,
  ) {
    return await this.authService.verifyEmail(verificationToken);
  }

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
  ): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req);
  }
}
