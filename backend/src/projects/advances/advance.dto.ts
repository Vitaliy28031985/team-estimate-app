import { IsNumber, IsString } from 'class-validator';

export class AdvanceDto {
  @IsString()
  comment: string;

  @IsString()
  date: string;

  @IsNumber({}, { message: 'sum має бути числом' })
  sum: number;
}
