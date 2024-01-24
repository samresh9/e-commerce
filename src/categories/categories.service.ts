import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  //Create New Category
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }
  //Find all categories
  async findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category Not Found');
    return category;
  }

  //find category with its product
  async findOneWithProducts(id: number) {
    const category = await this.categoryRepository.findOne({
      select: {
        products: true,
      },
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException('Category Not Found');
    return category;
  }

  //update one category
  async updateOne(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return this.categoryRepository.save({ ...category, ...updateCategoryDto });
  }
  //delete one category

  async deleteOne(id: number) {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }
}
