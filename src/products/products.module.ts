import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Category } from 'src/categories/entity/category.entity';
import { ProductImage } from './entity/product-image.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductImage]),
    CloudinaryModule, //to use other module service we need to import the module and the service should be in exports array of the imported module
    SearchModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
