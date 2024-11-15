import { IsString, IsIn } from 'class-validator';

export class UserUpdateRoleDto {
  @IsString()
  @IsIn(['executor', 'customer', 'admin'])
  role: string;
}
