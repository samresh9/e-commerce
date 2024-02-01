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
import { AuthModule } from './auth/auth.module';
import { UserToken } from './users/entity/user-token.entity';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'e-com',
      entities: [User, Product, Category, ProductImage, UserToken],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD, //global auth
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD, //global auth
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
