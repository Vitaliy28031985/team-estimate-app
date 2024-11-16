import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @ApiProperty({
    type: String,
    required: false,
    description:
      'В тілі запиту не потрібно подавати. Якщо така id потрібна backend її створить самостійно!',
  })
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
