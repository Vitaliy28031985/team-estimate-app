import { IsString, Matches } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';

export class UserUpdatePassword {
  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  oldPassword: string;

  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  newPassword: string;
}
