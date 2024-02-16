import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Cart } from 'src/cart/entity/cart.entity';
import { Category } from 'src/categories/entity/category.entity';
import { OrderItem } from 'src/orders/entity/order-item.entity';
import { Order } from 'src/orders/entity/order.entity';
import { ProductImage } from 'src/products/entity/product-image.entity';
import { Product } from 'src/products/entity/product.entity';
import { UserToken } from 'src/users/entity/user-token.entity';
import { User } from 'src/users/entity/user.entity';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST') || 'localhost',
      port: configService.get('DB_PORT') || 5432,
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [
        User,
        Product,
        Category,
        ProductImage,
        UserToken,
        Cart,
        Order,
        OrderItem,
      ],
      synchronize: true,
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
