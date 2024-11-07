import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  unit: string;

  @IsNumber({}, { message: 'number має бути числом' })
  number: number;

  @IsNumber({}, { message: 'price має бути числом' })
  price: number;
}
