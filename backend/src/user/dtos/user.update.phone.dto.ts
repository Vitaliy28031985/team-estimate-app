import { IsString, Matches } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';

export class UserUpdatePhone {
  @IsString()
  @Matches(keysSchemasString.PHONE, {
    message: ErrorsApp.NOT_VALID_PHONE,
  })
  phone: string;
}
