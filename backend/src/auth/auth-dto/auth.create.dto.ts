import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ErrorsApp } from 'src/common/errors';
import { keysSchemasString } from 'src/common/keys';
import { Allow } from 'src/mongo/schemas/user/allow.schema';

export class AuthCreateDto {
  @ApiProperty({
    type: String,
  })
  @IsString({ message: ErrorsApp.EMPTY_NAME })
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(keysSchemasString.PHONE, {
    message: ErrorsApp.NOT_VALID_PHONE,
  })
  phone: string;

  @ApiProperty({
    type: String,
    description:
      'Пароль має містити принаймні 6 символів та в його складі має бути принаймні одна літера та один спеціальний символ (*, #, & тощо)!',
  })
  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  password: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ enum: ['executor', 'customer', 'admin'] })
  @IsString()
  role: string;

  @IsOptional()
  @IsArray()
  projectIds: Allow[];

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsBoolean()
  verify: boolean;

  @IsOptional()
  @IsString()
  verificationToken: string;
}
