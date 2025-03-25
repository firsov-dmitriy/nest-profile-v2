import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, AuthModule],
})
export class PostsModule {}
