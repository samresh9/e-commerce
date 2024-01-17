import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async getAllProduct() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.findOne(parseInt(id));
  }

  @Put(':id')
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return await this.productService.update(updateProductDto, parseInt(id));
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.removeProduct(parseInt(id));
  }
}
