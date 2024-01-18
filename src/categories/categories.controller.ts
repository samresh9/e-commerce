import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpStatus,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Category Created',
      data: await this.categoriesService.create(createCategoryDto),
    };
  }

  @Get()
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.categoriesService.findAll(),
    };
  }

  @Get(':id/product')
  async getProductsOfCategory(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.categoriesService.findOneWithProducts(parseInt(id)),
    };
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Category Updated',
      data: await this.categoriesService.updateOne(
        parseInt(id),
        updateCategoryDto,
      ),
    };
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Category Deleted',
      data: await this.categoriesService.deleteOne(parseInt(id)),
    };
  }
}
