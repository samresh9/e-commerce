import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

class ProductDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  productId: number;
}
export class DeleteCartDto {
  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  products: ProductDto[];
}
