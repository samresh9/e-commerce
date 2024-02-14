import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { User } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/role.enum';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Controller('orders')
@ApiTags('Orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create A Order From Cart Or Directly' })
  async create(@Body() createOrderDto: CreateOrderDto, @User() userId: number) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order Created ',
      data: await this.ordersService.create(createOrderDto, userId),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get All the orders' })
  @Roles([Role.Admin])
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success ',
      data: await this.ordersService.findAll(),
    };
  }
  @Get(':orderId')
  @ApiOperation({ summary: 'Get Order by orderId' })
  async findOne(@Param('orderId', ParseIntPipe) orderId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success ',
      data: await this.ordersService.findOne(orderId),
    };
  }

  @Get('user')
  @Roles([Role.Customer])
  @ApiOperation({ summary: 'Get All Orders By User' })
  async findAllByUser(@User() userId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success ',
      data: await this.ordersService.findAllByUser(userId),
    };
  }

  @Post('cancel/:id')
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Cancel The Order' })
  async cancelled(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Order Cancelled ',
      data: await this.ordersService.cancelled(id, userId),
    };
  }

  @Put(':id')
  @Roles([Role.Admin])
  @ApiBody({
    type: UpdateOrderDto,
    description: 'Store product structure',
  })
  @ApiOperation({ summary: 'Update The Order Status' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @User() adminId: number,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Order Cancelled ',
      data: await this.ordersService.update(id, updateOrderDto, adminId),
    };
  }
}
