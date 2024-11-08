import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/mongo/schemas/user/user.schema';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { AuthCreateDto } from './auth-dto/auth.create.dto';
import { AuthLoginDto } from './auth-dto/auth.login.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any) {
    if (!req) return;
    return this.authService.loginWithGoogle(req.user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: AuthLoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('refresh/current')
  async RefreshToken(@Req() req: RequestWithUser) {
    return this.authService.refreshToken(req);
  }

  @Post('logout')
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req);
  }
}
