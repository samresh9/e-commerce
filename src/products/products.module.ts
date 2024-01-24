import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Category } from 'src/categories/entity/category.entity';
import { ProductImage } from './entity/product-image.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductImage]),
    CloudinaryModule, //to use other module service we need to import the module not the service
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
