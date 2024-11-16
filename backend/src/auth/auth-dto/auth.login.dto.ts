import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';

export class AuthLoginDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  password: string;
}
