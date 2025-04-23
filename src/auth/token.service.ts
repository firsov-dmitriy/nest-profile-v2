import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { JwtPayload } from '../types/JwtPayload';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JwtPayload): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, ...data } = payload;

    const uniquePayload = {
      ...data,
      iat: Math.floor(Date.now() / 1000),
    };
    return this.jwtService.sign(uniquePayload, {
      expiresIn: '1h',
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, ...data } = payload;

    const uniquePayload = {
      ...data,
      iat: Math.floor(Date.now() / 1000),
    };
    return this.jwtService.sign(uniquePayload, {
      expiresIn: '7d',
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify<JwtPayload>(token, {});
    } catch (err) {
      throw new UnauthorizedException('Недействительный refreshToken');
    }
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  setAccessTokenCookie(res: Response, accessToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
  }

  extractTokenFromHeader(req: Request): string | undefined {
    return req.cookies?.accessToken;
  }
}
