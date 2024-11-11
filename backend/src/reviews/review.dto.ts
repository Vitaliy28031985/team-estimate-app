import { IsNumber, IsString } from 'class-validator';

export class ReviewDto {
  //   @IsString()
  //   name: string;

  @IsString()
  comment: string;

  @IsNumber()
  rating: number;
}
