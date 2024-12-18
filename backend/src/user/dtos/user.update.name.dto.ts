import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserUpdateName {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;
}
