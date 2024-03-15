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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserAddressesDto } from './dtos/update-user-address.dto';
import { Role } from 'src/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user-addresses')
@ApiTags('User Address')
@ApiBearerAuth()
export class UserAddressesController {
  constructor(private readonly userAddressesService: UserAddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create User Address' })
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
  @ApiOperation({ summary: 'Get User Addresses' })
  async findByUser(@User() userId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userAddressesService.findAddressesByUserId(userId),
    };
  }

  @Get('all')
  @ApiOperation({ summary: 'Get All Users Addresses' })
  @Roles([Role.Admin])
  async findAll() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userAddressesService.findAll(),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update User Address' })
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
  @ApiOperation({ summary: 'Delete User Address' })
  async delete(@Param('id', ParseIntPipe) id: number, @User() userId: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Address Delted',
      data: await this.userAddressesService.delete(id, userId),
    };
  }
}
