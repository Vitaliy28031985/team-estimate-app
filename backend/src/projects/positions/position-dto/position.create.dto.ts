import { IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  title: string;

  @IsString()
  unit: string;

  @IsNumber({}, { message: 'number має бути числом' })
  number: number;

  @IsNumber({}, { message: 'price має бути числом' })
  price: number;
}
