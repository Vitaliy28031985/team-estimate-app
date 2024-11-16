import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UnitsDto {
  @ApiProperty({
    type: String,
    description: 'unit of work',
  })
  @IsString()
  title: string;
}
