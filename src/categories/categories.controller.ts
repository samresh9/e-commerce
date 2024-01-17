import { Body, Controller, Post, Get, Param, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() body: any) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Created',
      data: await this.categoriesService.create(body),
    };
  }

  @Get()
  async findAll() {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Created',
      data: await this.categoriesService.findAll(),
    };
  }

  @Get(':id/product')
  async getProductsOfCategory(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Created',
      data: await this.categoriesService.findOneWithProducts(parseInt(id)),
    };
  }
}
