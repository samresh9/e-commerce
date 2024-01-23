// update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  categoryId?: number;

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
