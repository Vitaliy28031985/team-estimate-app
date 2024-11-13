import { IsIn, IsOptional, IsString } from 'class-validator';

export class ReviewDto {
  @IsString()
  comment: string;

  @IsIn([1, 2, 3, 4, 5])
  rating: number;
}

export class ReviewUpdateDto {
  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsIn([1, 2, 3, 4, 5])
  rating: number;
}
