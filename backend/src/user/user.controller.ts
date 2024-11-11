import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UserUpdateEmailDto } from './dtos/user.update.email.dto';

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
}
