import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpStatus,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { User } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { DeleteCartDto } from './dtos/delete-cart.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/role.enum';

@Controller('cart')
@ApiBearerAuth()
@ApiTags('Carts')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UsersService,
  ) {}
  @Post()
  @ApiOperation({ summary: 'Add Products To Cart' })
  async addToCart(
    @Body() createCartDto: CreateCartDto,
    @User() userId: number,
  ) {
    const currentUser = await this.userService.findOne(userId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Cart Created',
      data: await this.cartService.addToCart(createCartDto, currentUser),
    };
  }

  @Put('update')
  @ApiOperation({ summary: 'Update Product of Cart' })
  async updateCart(
    @Body() updateCartDto: CreateCartDto,
    @User() userId: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Cart Updated',
      data: await this.cartService.updateCart(updateCartDto, userId),
    };
  }

  @Get()
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Get All Carts' })
  async getAllCart() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.cartService.getAllCart(),
    };
  }

  @Get(':userId')
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Get  Carts By UserId' })
  async getCartByUSerId(@Param('userId', ParseIntPipe) userId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.cartService.getCartByUserId(userId),
    };
  }

  @Get('user/cart')
  @Roles([Role.Customer])
  @ApiOperation({ summary: 'Get All Carts By User' })
  async getCartByUser(@User() userId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.cartService.getCartByUserId(userId),
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete the Cart' })
  async delete(@User() userId: number, @Body() deleteCartDto: DeleteCartDto) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Cart Deleted',
      data: await this.cartService.delete(userId, deleteCartDto),
    };
  }
}
