import { IsEmail, IsNumber, Matches } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';

export class VerifyCodeDto {
  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;

  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  password: string;

  @IsNumber({}, { message: 'code має бути числом' })
  code: number;
}
