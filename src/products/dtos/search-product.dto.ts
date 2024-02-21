import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchProductDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  @IsOptional()
  minPrice?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Page Size should not be less than 1 or Empty' })
  @Transform(({ value }) => Number(value))
  maxPrice?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  search?: string;
}
