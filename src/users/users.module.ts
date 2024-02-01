import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserToken } from './entity/user-token.entity';

@Module({
  // imports:[UserRepository]
  imports: [TypeOrmModule.forFeature([User, UserToken])], // This import makes User entity and its repository available in this module.
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
