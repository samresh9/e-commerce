import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user-dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/role.enum';
@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Get All Users' })
  async getAllUsers() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userService.find(),
    };
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Create New User' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Created',
      data: await this.userService.createUser(createUserDto),
    };
  }
  @Get(':id')
  @ApiBearerAuth()
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Get User by id' })
  async getUserById(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userService.findOne(parseInt(id)),
    };
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Update User Information' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Updated',
      data: await this.userService.updateUser(parseInt(id), updateUserDto),
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Delete User' })
  async removeUser(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'User Deleted',
      data: await this.userService.removeUser(parseInt(id)),
    };
  }
}
