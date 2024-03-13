import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}
