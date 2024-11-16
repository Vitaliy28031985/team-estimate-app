import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DiscountDto {
  @ApiProperty({
    type: Number,
  })
  @IsNumber({}, { message: 'discount має бути числом' })
  discount: number;
}
