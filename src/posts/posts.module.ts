import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { VercelBlobModule } from '../vercel-blob/vercel-blob.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, AuthModule, VercelBlobModule],
})
export class PostsModule {}
