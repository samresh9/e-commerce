import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  HttpStatus,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user-dto';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  async getAllUsers() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userService.find(),
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Create New User' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Created',
      data: await this.userService.createUser(createUserDto),
    };
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get User by id' })
  async getUserById(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userService.findOne(parseInt(id)),
    };
  }

  @Put(':id')
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
  @ApiOperation({ summary: 'Delete User' })
  async removeUser(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'User Deleted',
      data: await this.userService.removeUser(parseInt(id)),
    };
  }
}
