import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { config } from 'dotenv';
import { AuthService } from './auth.service';
import { User } from 'src/mongo/schemas/user/user.schema';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { AuthCreateDto } from './auth-dto/auth.create.dto';
import { AuthLoginDto } from './auth-dto/auth.login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserUpdateEmailDto } from 'src/user/dtos/user.update.email.dto';
import { VerifyCodeDto } from './auth-dto/verify.code.dto';
config();
const { CORS_LINK } = process.env;

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
  @Redirect(CORS_LINK, 302)
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

  @Post('send/verify')
  @UsePipes(new ValidationPipe())
  async sendVerifyCode(@Body() dto: UserUpdateEmailDto) {
    return this.authService.sendVerifyCode(dto);
  }

  @Post('verify')
  @UsePipes(new ValidationPipe())
  async verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto);
  }
}
