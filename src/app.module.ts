import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entity/product.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entity/category.entity';
import { ProductImage } from './products/entity/product-image.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Samresh7@',
      database: 'e-com',
      entities: [User, Product, Category, ProductImage],
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
