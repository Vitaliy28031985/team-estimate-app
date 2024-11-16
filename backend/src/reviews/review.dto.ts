import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ReviewDto {
  @ApiProperty({
    type: String,
    description: 'comment for app',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'The rating',
    minimum: 1,
    maximum: 5,
  })
  @IsIn([1, 2, 3, 4, 5])
  rating: number;
}

export class ReviewUpdateDto {
  @ApiProperty({
    type: String,
    description: 'comment for app',
  })
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'The rating',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsIn([1, 2, 3, 4, 5])
  rating: number;
}
