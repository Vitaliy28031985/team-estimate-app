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
  @IsString({ message: ErrorsApp.EMPTY_NAME })
  name: string;

  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;

  @IsOptional()
  @IsString()
  @Matches(keysSchemasString.PHONE, {
    message: ErrorsApp.NOT_VALID_PHONE,
  })
  phone: string;

  @IsString()
  @Matches(keysSchemasString.PASSWORD, {
    message: ErrorsApp.NOT_VALID_PASSWORD,
  })
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;

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
