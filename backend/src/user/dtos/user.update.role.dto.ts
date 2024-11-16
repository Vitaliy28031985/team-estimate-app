import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class UserUpdateRoleDto {
  @ApiProperty({ enum: ['executor', 'customer', 'admin'] })
  @IsString()
  @IsIn(['executor', 'customer', 'admin'])
  role: string;
}
