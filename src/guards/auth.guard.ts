import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // getAllAndOverride- Retrieve metadata for a specified key for a specified set of targets and return a first not undefined value.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Unauthorised Access');
    try {
      const payload = await this.jwtService.verify(token);
      request['user'] = payload;
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
