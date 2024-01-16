import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async createProduct(@Body() body: any) {
    return this.productService.Create(body);
  }
}
