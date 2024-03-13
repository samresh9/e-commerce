import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, Min } from 'class-validator';

class ProductDto {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}
export class CreateOrderDto {
  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @Type(() => ProductDto)
  products: ProductDto[];

  @ApiProperty()
  @IsBoolean()
  cartItem: boolean;
}
