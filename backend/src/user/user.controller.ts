import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UserUpdateEmailDto } from './dtos/user.update.email.dto';
import { UserUpdatePhone } from './dtos/user.update.phone.dto';
import { UserUpdatePassword } from './dtos/user.update.password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  async currentUser(@Req() req: RequestWithUser) {
    return await this.userService.getCurrentUser(req);
  }

  @Put('name')
  async changeName(@Body() dto: { name: string }, @Req() req: RequestWithUser) {
    return await this.userService.changeName(dto, req);
  }

  @Put('email')
  @UsePipes(new ValidationPipe())
  async changeEmail(
    @Body() dto: UserUpdateEmailDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.changeEmail(dto, req);
  }

  @Get('/verify/:verificationToken')
  async verifyUser(
    @Param('verificationToken')
    verificationToken: string,
  ) {
    return await this.userService.verifyEmail(verificationToken);
  }

  @Put('phone')
  @UsePipes(new ValidationPipe())
  async changePhone(@Body() dto: UserUpdatePhone, @Req() req: RequestWithUser) {
    return await this.userService.changePhone(dto, req);
  }

  @Put('role')
  @UsePipes(new ValidationPipe())
  async changeRole(@Body() dto: { role: string }, @Req() req: RequestWithUser) {
    return await this.userService.changeRole(dto, req);
  }

  @Put('password')
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Body() dto: UserUpdatePassword,
    @Req() req: RequestWithUser,
  ) {
    return await this.userService.changePassword(dto, req);
  }
}
