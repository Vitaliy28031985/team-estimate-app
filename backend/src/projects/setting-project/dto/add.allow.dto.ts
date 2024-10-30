import { IsOptional, IsString } from 'class-validator';

export class AddAllowDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsString()
  allowLevel: string;

  @IsString()
  lookAt: string;

  @IsString()
  lookAtTotals: string;
}
