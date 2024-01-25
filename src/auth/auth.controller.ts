import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sigin-in.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK) // status code in response object
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sign-in successful',
    type: SignInDto, // Add a DTO class for the response body
  })
  async signIn(@Body() signInDto: SignInDto) {
    return {
      statusCode: HttpStatus.OK,
      message: 'SignIn Success',
      data: {
        accessToken: await this.authservice.signIn(signInDto),
      },
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async check() {
    return {
      message: 'Success',
    };
  }
}
