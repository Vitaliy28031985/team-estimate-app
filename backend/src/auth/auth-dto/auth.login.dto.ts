import { IsEmail, IsString, Matches } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';

export class AuthLoginDto {
  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;

  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  password: string;
}
