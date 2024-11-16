import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MaterialDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  order: string;

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
