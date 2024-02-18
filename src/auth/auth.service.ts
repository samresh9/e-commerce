import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sigin-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as uuid from 'uuid';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AuthTokens, UserPayload } from './types/auth.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Email or Password Incorrect ');
    const payload: UserPayload = {
      sub: user.id,
      tokenId: uuid.v4(),
      email: user.email,
      roles: [user.roles],
    };
    const tokens = this.genereateAccessAndRefreshToken(payload);
    return tokens;
  }

  async genereateAccessAndRefreshToken(
    payload: UserPayload,
  ): Promise<AuthTokens> {
    const { sub, tokenId } = payload;

    const accessToken = this.jwtService.sign(payload, {
      // expiresIn: process.env.JWT_ACCESS_EXP,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXP'),
      // secret: this.configService.get<string>('JWT_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      // expiresIn: process.env.JWT_REFRESH_EXP,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXP'),
      // secret: this.configService.get<string>('JWT_SECRET'),
    });
    await this.userService.saveTokenId(sub, tokenId);
    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const payload: UserPayload | null =
      await this.verifyRefreshToken(refreshToken);

    // const currentTimeStamp = Date.now();
    // const timeDifference = expiryTimeStamp - currentTimeStamp;
    // if (timeDifference <= 0) {
    //   throw new UnauthorizedException('Invalid or expired refresh token');
    // }
    if (!payload)
      throw new UnauthorizedException('Invalid or Expired Refresh Token');

    const { sub: id, tokenId, email, roles } = payload;
    const hasValidToken = await this.userService.hasValidToken(id, tokenId);
    if (hasValidToken) {
      const newPayload: UserPayload = {
        sub: payload.sub,
        tokenId: uuid.v4(),
        email,
        roles,
      };
      return this.genereateAccessAndRefreshToken(newPayload);
    }
    throw new UnauthorizedException('Invalid Refresh Token');
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verify(refreshToken);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Handle the expired token error here
        return null;
      }
      throw new UnauthorizedException('Token Verifiction Error');
    }
  }
}
