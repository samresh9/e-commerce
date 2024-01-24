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
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create  A new Category' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Category Created',
      data: await this.categoriesService.create(createCategoryDto),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Find All Categories' })
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.categoriesService.findAll(),
    };
  }

  @Get(':id/product')
  @ApiOperation({ summary: 'Get all products related to the category by Id' })
  async getProductsOfCategory(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.categoriesService.findOneWithProducts(id),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update one Category' })
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
  @ApiOperation({ summary: 'Delete One Category' })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Category Deleted',
      data: await this.categoriesService.deleteOne(id),
    };
  }
}
