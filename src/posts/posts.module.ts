import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseWrapperInterceptor } from '../../common/interceptors/response.wrapper.interceptor';

@Module({
  controllers: [PostsController],
  providers: [
    PostsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
  ],
  imports: [PrismaModule, JwtModule, AuthModule],
})
export class PostsModule {}
