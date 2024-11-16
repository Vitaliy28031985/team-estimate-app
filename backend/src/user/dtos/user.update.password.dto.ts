import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';

export class UserUpdatePassword {
  @ApiProperty({
    type: String,
    description:
      'Пароль має містити принаймні 6 символів та в його складі має бути принаймні одна літера та один спеціальний символ (*, #, & тощо)!',
  })
  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  oldPassword: string;

  @ApiProperty({
    type: String,
    description:
      'Пароль має містити принаймні 6 символів та в його складі має бути принаймні одна літера та один спеціальний символ (*, #, & тощо)!',
  })
  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  newPassword: string;
}
