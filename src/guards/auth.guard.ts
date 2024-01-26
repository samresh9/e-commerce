import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Unauthorised Access');
    try {
      const payload = await this.jwtService.verify(token);
      request['User'] = payload;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // here nullish coalescing operator returns [] when authorization value is null or undefined,
    const [type, token] = request.headers['authorization']?.split(' ') ?? []; // using dot notation for authorization gives ts error
    return type === 'Bearer' ? token : undefined;
  }
}
