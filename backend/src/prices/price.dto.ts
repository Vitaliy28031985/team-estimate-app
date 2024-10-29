import { IsNumber, IsString } from 'class-validator';

export class PricesDto {
  @IsString()
  title: string;

  @IsNumber({}, { message: 'price має бути числом' })
  price: number;
}
