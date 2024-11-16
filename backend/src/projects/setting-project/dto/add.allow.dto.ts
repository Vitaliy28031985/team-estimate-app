import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddAllowDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({ enum: ['read', 'write'] })
  @IsString()
  allowLevel: string;

  @ApiProperty({ enum: ['large', 'small', 'all'] })
  @IsString()
  lookAt: string;

  @ApiProperty({ enum: ['show', 'notShow'] })
  @IsString()
  lookAtTotals: string;
}
