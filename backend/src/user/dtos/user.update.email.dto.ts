import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { ErrorsApp } from 'src/common/errors';

export class UserUpdateEmailDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail({}, { message: ErrorsApp.NOT_VALID_EMAIL })
  email: string;
}
