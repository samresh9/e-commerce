import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async Create(body: any) {
    const product = this.productRepository.create(body);
    return this.productRepository.save(product);
  }
}
