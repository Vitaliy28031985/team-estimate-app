import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/mongo/schemas/user/user.schema';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { AuthCreateDto } from './auth-dto/auth.create.dto';
import { AuthLoginDto } from './auth-dto/auth.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: AuthCreateDto): Promise<User> {
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
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: AuthLoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req);
  }
}
