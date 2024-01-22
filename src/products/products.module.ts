import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Category } from 'src/categories/entity/category.entity';
import { ProductImage } from './entity/product-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, ProductImage])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
