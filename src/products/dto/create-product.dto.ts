import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
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
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  images: [
    {
      url: string;
      title: string;
    },
  ];
}
