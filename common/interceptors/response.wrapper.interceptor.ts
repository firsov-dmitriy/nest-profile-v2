import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data, // Основные данные
          meta: {
            timestamp: new Date().toISOString(), // Пример мета-информации
            statusCode: context.switchToHttp().getResponse().statusCode,
          },
        };
      }),
    );
  }
}
