import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserToken } from './entity/user-token.entity';
import { Cart } from 'src/cart/entity/cart.entity';
import { MailerServiceModule } from 'src/mailer-service/mailer-service.module';
import { PasswordResetService } from './users.password-reset.service';
import { PasswordResetToken } from './entity/password-reset.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken, Cart, PasswordResetToken]),
    MailerServiceModule,
  ], // This import makes User entity and its repository available in this module.
  controllers: [UsersController],
  providers: [UsersService, PasswordResetService],
  exports: [UsersService],
})
export class UsersModule {}
