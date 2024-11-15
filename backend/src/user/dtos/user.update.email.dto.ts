import { IsEmail } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';

export class UserUpdateEmailDto {
  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;
}
