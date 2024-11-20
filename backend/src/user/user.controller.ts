import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/interfaces/requestWithUser';
import { UserUpdateEmailDto } from './dtos/user.update.email.dto';
import { UserUpdatePhone } from './dtos/user.update.phone.dto';
import { UserUpdatePassword } from './dtos/user.update.password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorsApp } from 'src/common/errors';
import { UserUpdateRoleDto } from './dtos/user.update.role.dto';
import { UserUpdateName } from './dtos/user.update.name.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('current')
  async currentUser(@Req() req: RequestWithUser) {
    return await this.userService.getCurrentUser(req);
  }

  @Put('name')
  async changeName(@Body() dto: UserUpdateName, @Req() req: RequestWithUser) {
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
  async changeRole(
    @Body() dto: UserUpdateRoleDto,
    @Req() req: RequestWithUser,
  ) {
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

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async changeAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^(image\/jpeg|image\/jpg|image\/png|image\/svg\+xml)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new Error(ErrorsApp.NOT_UPDATE_AVATAR);
    }
    return await this.userService.changeAvatar(file, req);
  }
}
