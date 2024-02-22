import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigAsync } from './database/typeOrm.config';
import { UserAddressModule } from './user_addresses/user_addresses.module';
import { MailerServiceModule } from './mailer-service/mailer-service.module';

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
    MailerServiceModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, //global serializer
    },
  ],
})
export class AppModule {}
