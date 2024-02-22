import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ProductsService } from 'src/products/products.service';
import { OrderItem } from './entity/order-item.entity';
import { CartService } from 'src/cart/cart.service';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly cartService: CartService,
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const user = await this.usersService.findOne(userId);
    const orderItems = await Promise.all(
      createOrderDto.products.map(async ({ productId, quantity }) => {
        const product = await this.productsService.findOne(productId);

        if (quantity > product.stock) {
          throw new BadRequestException(
            `Order quantity greater than stock quantity`,
          );
        }

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
    let order = this.ordersRepository.create({
      user,
      orderItems: savedOrderItems,
      total_price: totalPrice,
    });
    order = await this.ordersRepository.save(order);
    await this.productsService.stockUpdate(order.orderItems);
    return order;
  }

  async findOne(id: number) {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('orderItems.product', 'product')
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.email'])
      .where('order.id= :id', { id })
      .getOne();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findAll() {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.user', 'user')
      .getMany();
    return orders;
  }

  async findAllByUser(userId: number) {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoin('order.user', 'user')
      .addSelect(['user.id', 'user.email'])
      .where('user.id = :userId', { userId })
      .getMany();
    return orders;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, adminId: number) {
    const { orderStatus } = updateOrderDto;
    const order = await this.ordersRepository.findOne({ where: { id } });
    const admin = await this.usersService.findOne(adminId);
    if (!order) throw new NotFoundException('Order not Found');

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order already ${order.status}`);
    }
    if (
      order.status === OrderStatus.PROCESSING &&
      updateOrderDto.orderStatus === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException(`Delivery Before Shipping`);
    }

    if (
      order.status === OrderStatus.SHIPPED &&
      updateOrderDto.orderStatus === OrderStatus.SHIPPED
    )
      return order;

    // if (updateOrderDto.orderStatus === OrderStatus.SHIPPED) {
    //   order.shipped_at = new Date();
    // }

    // if (updateOrderDto.orderStatus === OrderStatus.DELIVERED) {
    //   order.delivered_at = new Date();
    // }
    // order.updated_by = admin;
    // order = await this.ordersRepository.save(order);

    await this.ordersRepository
      .createQueryBuilder()
      .update(Order)
      .set({
        status: orderStatus,
        updated_by: admin,
        delivered_at:
          orderStatus === OrderStatus.DELIVERED
            ? new Date()
            : order.delivered_at,
        shipped_at:
          orderStatus === OrderStatus.DELIVERED
            ? new Date()
            : order.delivered_at,
      })
      .where('id = :id', { id })
      .execute();
    const updatedOrder = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoin('order.updated_by', 'updated_by')
      .addSelect(['updated_by.id', 'updated_by.firstName'])
      .where('order.id = :id', { id })
      .getOne();
    return updatedOrder;
  }

  async cancelled(id: number, userId: number) {
    const order = await this.findOne(id);
    const user = await this.usersService.findOne(userId);
    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }
    order.status = OrderStatus.CANCELLED;
    order.updated_by = user;
    const updatedOrder = await this.ordersRepository.save(order);
    const cancelled = true;
    await this.productsService.stockUpdate(updatedOrder.orderItems, cancelled);
    return updatedOrder;
  }
}
