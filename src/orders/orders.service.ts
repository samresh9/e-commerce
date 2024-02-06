import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ProductsService } from 'src/products/products.service';
import { OrderItem } from './entity/order-item.entity';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const user = await this.productsService.findOne(userId);
    const orderItems = await Promise.all(
      createOrderDto.products.map(async ({ productId, quantity }) => {
        const product = await this.productsService.findOne(productId);
        const price = product.price * quantity;
        const orderItem = this.orderItemRepository.create({
          product,
          quantity,
          price,
        });
        return orderItem;
      }),
    );
    //calculate total price of order
    const totalPrice = orderItems.reduce(
      (sum, orderItem) => (sum = sum + orderItem.price),
      0,
    );

    //if the cartItem is true then deletes the cart and places order
    if (createOrderDto.cartItem) {
      await this.cartService.delete(userId, {
        products: createOrderDto.products,
      });
    }

    const savedOrderItems = await this.orderItemRepository.save(orderItems);
    const order = this.ordersRepository.create({
      user,
      orderItems: savedOrderItems,
      total_price: totalPrice,
    });

    return this.ordersRepository.save(order);
  }
}
