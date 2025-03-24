import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

import { TokenService } from '../auth/token.service';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { VercelBlobService } from '../vercel-blob/vercel-blob.service';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
    private vercelBlobService: VercelBlobService,
  ) {}
  async create(createPostDto: CreatePostDto, request: Request) {
    // const author = await this.authService.validateUser(request);
    console.log(createPostDto);

    const { file, ...createPost } = createPostDto;

    const { url: imageUrl } = await this.vercelBlobService.create(request.file);
    return this.prismaService.post.create({
      data: {
        ...createPost,
        authorId: '0580b659-04ba-4812-8b03-f10154452718',
        imageUrl,
      },
    });
  }

  async findAll() {
    return this.prismaService.post.findMany();
  }

  findOne(id: number) {
    return this.prismaService.post.findUnique({ where: { id } });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prismaService.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: number) {
    return this.prismaService.post.delete({ where: { id } });
  }
}
