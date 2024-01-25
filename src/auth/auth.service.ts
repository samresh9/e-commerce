import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sigin-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Email or Password Incorect ');
    const payload = {
      sub: user.id,
      tokenId: uuid.v4(),
      email: user.email,
    };
    const { accessToken, refreshToken } =
      await this.genereateAccessAndRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async genereateAccessAndRefreshToken(payload) {
    const { sub, tokenId } = payload;
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
    });

    await this.userService.saveTokenId(sub, tokenId);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken() {}
}
