import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  HttpStatus,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
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
  async getProductsOfCategory(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.categoriesService.findOneWithProducts(id),
    };
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Category Updated',
      data: await this.categoriesService.updateOne(id, updateCategoryDto),
    };
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Category Deleted',
      data: await this.categoriesService.deleteOne(id),
    };
  }
}
