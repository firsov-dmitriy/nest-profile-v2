import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = request.cookies?.accessToken;
    if (!token) {
      throw new UnauthorizedException('Токен не найден');
    }

    try {
      const payload = await this.tokenService.verifyRefreshToken(token);
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
        select: {
          email: true,
          firstName: true,
          lastName: true,
          middleName: true,
          role: true,
        },
      });

      if (!user) {
        new UnauthorizedException('Пользователь не найден');
      }

      request.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Недействительный токен');
    }
  }
}
