import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserAddressesService } from './user_addresses.service';
import { User } from 'src/decorators/current-user.decorator';
import { CreateUserAddressesDto } from './dtos/create-user-address.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserAddressesDto } from './dtos/update-user-address.dto';
import { Role } from 'src/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user-addresses')
@ApiTags('User Address')
@ApiBearerAuth()
export class UserAddressesController {
  constructor(private readonly userAddressesService: UserAddressesService) {}

  @Post()
  async create(
    @Body() createUserAddressesDto: CreateUserAddressesDto,
    @User() userId: number,
  ) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Address Created',
      data: await this.userAddressesService.create(
        createUserAddressesDto,
        userId,
      ),
    };
  }

  @Get()
  async findByUser(@User() userId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userAddressesService.findAddressesByUserId(userId),
    };
  }

  @Get('all')
  @Roles([Role.Admin])
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userAddressesService.findAll(),
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,
    @Body() updateUserAddressDto: UpdateUserAddressesDto,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Address Updated',
      data: await this.userAddressesService.update(
        updateUserAddressDto,
        id,
        userId,
      ),
    };
  }
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @User() userId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Address Delted',
      data: await this.userAddressesService.delete(id, userId),
    };
  }
}
