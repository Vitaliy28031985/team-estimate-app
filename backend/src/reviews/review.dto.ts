import { IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  comment: string;

  @IsNumber()
  rating: number;
}
