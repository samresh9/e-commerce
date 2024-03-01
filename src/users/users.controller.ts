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
import { User } from 'src/decorators/current-user.decorator';
import { PasswordResetService } from './users.password-reset.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ForgotPasswordDto } from './dtos/forgor-password.dto';
@Controller('users')
@ApiBearerAuth()
@ApiTags('User')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Get()
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
  @Get('user/:id')
  @Roles([Role.Admin])
  @ApiOperation({ summary: 'Get User by id' })
  async getUserById(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.userService.findOne(parseInt(id)),
    };
  }

  // @Public()
  // @Get('mail')
  // async sendMail() {
  //   return await this.userService.sendMail();
  // }

  @Put()
  @Roles([Role.Customer, Role.Admin])
  @ApiOperation({ summary: 'Update User Information' })
  async updateUser(
    @User() userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User Updated',
      data: await this.userService.updateUser(userId, updateUserDto),
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

  @Post('/forgotPassword')
  @Public()
  async requestResetPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const message =
      await this.passwordResetService.requestPasswordReset(forgotPasswordDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: message,
      data: '',
    };
  }

  @Post('/resetPassword')
  @Public()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const message =
      await this.passwordResetService.resetPassword(resetPasswordDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: message,
      data: '',
    };
  }
}
