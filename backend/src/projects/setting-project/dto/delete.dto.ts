import { IsString } from 'class-validator';

export class DeleteAllowDto {
  @IsString()
  email: string;
}
