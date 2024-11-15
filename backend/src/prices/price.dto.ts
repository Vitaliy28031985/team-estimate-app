import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class PricesDto {
  @IsOptional()
  @Expose()
  id?: Types.ObjectId;

  @IsString()
  title: string;

  @IsNumber({}, { message: 'price має бути числом' })
  price: number;

  @IsOptional()
  @IsBoolean()
  updateAllow?: boolean;
}
