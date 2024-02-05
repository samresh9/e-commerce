import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { CreateCartDto } from './dtos/create-cart.dto';
import { UserPayload } from 'src/auth/types/auth.types';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
  ) {}

  async addToCart(createCartDto: CreateCartDto, user: User) {
    const product = await this.productsService.findOne(
      createCartDto.product_id,
    );
    const existingCart = await this.cartRepository
      .createQueryBuilder('cart')
      .innerJoin('cart.user', 'user')
      .addSelect(['user.id'])
      .innerJoinAndSelect('cart.product', 'product')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('product.id = :productId', { productId: product.id })
      .getOne();
    if (existingCart) {
      existingCart.quantity += createCartDto.quantity;
      return await this.cartRepository.save(existingCart);
    }
    const cart = this.cartRepository.create({
      user,
      quantity: createCartDto.quantity,
      product,
    });
    return await this.cartRepository.save(cart);
  }

  async updateCart(updateCartDto: CreateCartDto, userId: number) {
    const { quantity, product_id } = updateCartDto;
    const existingCart = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: product_id },
      },
    });
    if (existingCart) {
      existingCart.quantity = quantity;
      return await this.cartRepository.save(existingCart);
    }
  }

  async getCartByUserId(userId: number) {
    return await this.cartRepository
      .createQueryBuilder('cart')
      .innerJoin('cart.user', 'user')
      .innerJoinAndSelect('cart.product', 'product')
      .where('user.id = :id', { id: userId })
      .getMany();
  }

  async getAllCart() {
    return await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .leftJoinAndSelect('cart.product', 'product')
      .getMany();
  }
}
