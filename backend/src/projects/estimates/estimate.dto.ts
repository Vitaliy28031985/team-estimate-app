import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class EstimateDto {
  @ApiProperty({
    type: Types.ObjectId,
    required: false,
    description:
      'В тілі запиту не потрібно подавати. Якщо така id потрібна backend її створить самостійно!',
  })
  @IsOptional()
  @Expose()
  id?: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  @IsString()
  title: string;
}
