import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from './database/typeOrm.config';
import { UserAddressModule } from './user_addresses/user_addresses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
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
