import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, Matches } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';

export class VerifyCodeDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;

  @ApiProperty({
    type: String,
    description:
      'Пароль має містити принаймні 6 символів та в його складі має бути принаймні одна літера та один спеціальний символ (*, #, & тощо)!',
  })
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  password: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber({}, { message: 'code має бути числом' })
  code: number;
}
