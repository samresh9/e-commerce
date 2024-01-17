import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entity/product.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Samresh7@',
      database: 'e-com',
      entities: [User, Product, Category],
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
