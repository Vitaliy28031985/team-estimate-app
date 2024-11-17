import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class EstimateDto {
  @IsOptional()
  @Expose()
  id?: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  @IsString()
  title: string;
}
