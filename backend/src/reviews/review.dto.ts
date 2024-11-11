import { IsInt, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString()
  comment: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
