import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  unit: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber({}, { message: 'number має бути числом' })
  number: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber({}, { message: 'price має бути числом' })
  price: number;
}
