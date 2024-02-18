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
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entity/cart.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entity/order.entity';
import { OrderItem } from './orders/entity/order-item.entity';
import { UserAddressModule } from './user_addresses/user_addresses.module';
import { UserAddress } from './user_addresses/entity/user_addresses.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'e-com',
      entities: [
        User,
        Product,
        Category,
        ProductImage,
        UserToken,
        Cart,
        Order,
        OrderItem,
        UserAddress,
      ],
      synchronize: true,
    }),

    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CloudinaryModule,
    CartModule,
    OrdersModule,
    UserAddressModule,
  ],
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
