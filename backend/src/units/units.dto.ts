import { IsString } from 'class-validator';

export class UnitsDto {
  @IsString()
  title: string;
}
