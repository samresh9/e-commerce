import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entity/category.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  //creates new product
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category Not found');
    }
    const product = this.productRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      category,
    });
    return this.productRepository.save(product);
  }

  //finds one product by its id
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      select: {
        category: {
          id: true,
          name: true,
        },
      },
      where: { productId: id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return product;
  }

  //finds all product with category detail
  async findAll() {
    return this.productRepository.find({
      select: {
        category: {
          id: true,
          name: true,
        },
      },
      relations: ['category'],
    });
  }

  //update the product details
  async update(updateProductDto: any, id: number) {
    const product = await this.productRepository.findOneBy({
      productId: id,
    });

    if (!product) throw new NotFoundException('Product Not Found');
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      product.category = category;
    }
    return this.productRepository.save({ ...product, ...updateProductDto });
  }

  //delete the product
  async removeProduct(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }
}
