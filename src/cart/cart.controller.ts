import { Controller, Post, Body, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { UserPayload } from 'src/auth/types/auth.types';

@Controller('cart')
@ApiBearerAuth()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UsersService,
  ) {}
  @Post()
  async addToCart(
    @Body() createCartDto: CreateCartDto,
    @User() user: UserPayload,
  ) {
    const currentUser = await this.userService.findOne(user.sub);
    return this.cartService.addToCart(createCartDto, currentUser);
  }

  @Post('update')
  async updateCart(
    @Body() updateCartDto: CreateCartDto,
    @User() user: UserPayload,
  ) {
    const userId = user.sub;
    return this.cartService.updateCart(updateCartDto, userId);
  }

  @Get()
  async getAllCart() {
    return this.cartService.getAllCart();
  }

  @Get('user')
  async getCartByUser(@User() user: UserPayload) {
    return this.cartService.getCartByUserId(user.sub);
  }
}
