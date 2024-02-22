import { Module } from '@nestjs/common';
import { UserAddressesService } from './user_addresses.service';
import { UserAddressesController } from './user_addresses.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entity/user_addresses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress]), UsersModule],
  providers: [UserAddressesService],
  controllers: [UserAddressesController],
})
export class UserAddressModule {}
