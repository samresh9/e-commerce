import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty()
  @ValidateIf((req) => !req.description || req.name) // runs validation if it returns true
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @ValidateIf((req) => !req.name || req.description)
  @IsString()
  @IsNotEmpty()
  description: string;
}
