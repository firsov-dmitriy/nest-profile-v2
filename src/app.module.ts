import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import * as process from 'node:process';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.USER_DB_NAME}:${process.env.USER_DB_PASSWORD}@cluster0.0fxwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
