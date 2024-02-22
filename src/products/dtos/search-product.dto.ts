import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

enum Sort {
  ASEC = 'asc',
  DESC = 'desc',
}
export class SearchProductDto {
  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Number(value))
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  maxPrice?: number;

  @ApiProperty({ enum: Sort, required: false })
  @IsEnum(Sort)
  @IsOptional()
  sort?: Sort;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  search: string;
}
