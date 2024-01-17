import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(body: any) {
    const category = this.categoryRepository.create(body);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category Not Found');
    return category;
  }

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
}
