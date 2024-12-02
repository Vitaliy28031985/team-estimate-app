import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class PricesDto {
  @IsOptional()
  @Expose()
  id?: Types.ObjectId;

  @IsOptional()
  @Expose()
  owner?: Types.ObjectId;

  @ApiProperty({
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber({}, { message: 'price має бути числом' })
  price: number;

  @ApiProperty({
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  updateAllow?: boolean;
}
