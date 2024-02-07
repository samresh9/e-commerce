import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  price: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(0)
  stock: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  categoryId: number;

  @ApiProperty({
    type: 'array',
    required: false,
    items: { type: 'file', format: 'binary' },
  })
  files: Express.Multer.File[];

  @IsOptional()
  @IsArray()
  images: string[];
}
