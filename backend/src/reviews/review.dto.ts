import {
  // IsEnum,
  IsIn,
  // IsInt,
  IsOptional,
  IsString,
  // Max,
  // Min,
} from 'class-validator';

export class ReviewDto {
  @IsString()
  comment: string;

  // @IsInt()
  // @Min(1)
  // @Max(5)
  // @IsEnum({ one: 1, two: 2, three: 3, four: 4, five: 5 })
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
