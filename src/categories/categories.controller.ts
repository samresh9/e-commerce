import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() body: any) {
    return this.categoriesService.create(body);
  }
}
