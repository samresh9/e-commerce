import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class TestDto {
  @ApiProperty({ type: 'file', format: 'binary' })
  @IsOptional()
  files: Express.Multer.File;

  @ApiProperty({ required: false })
  @IsNumber()
  number: number;

  @ApiProperty({ required: false })
  @IsString()
  name: string;
}
