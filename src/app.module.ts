import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entity/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Samresh7@',
      database: 'e-com',
      entities: [User, Product],
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
