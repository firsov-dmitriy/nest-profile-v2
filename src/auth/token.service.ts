import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TokenService {
  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
