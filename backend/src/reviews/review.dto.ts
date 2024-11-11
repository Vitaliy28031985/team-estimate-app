import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString()
  comment: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

export class ReviewUpdateDto {
  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
