import { IsNumber, IsString } from 'class-validator';

export class MaterialDto {
  @IsString()
  title: string;

  @IsString()
  order: string;

  @IsString()
  date: string;

  @IsNumber({}, { message: 'sum має бути числом' })
  sum: number;
}
