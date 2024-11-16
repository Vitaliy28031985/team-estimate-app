import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AdvanceDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  comment: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  date: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber({}, { message: 'sum має бути числом' })
  sum: number;
}
