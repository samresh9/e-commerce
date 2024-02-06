import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { User } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @User() userId: number) {
    return await this.ordersService.create(createOrderDto, userId);
  }
}
