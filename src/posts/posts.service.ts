import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { PrismaService } from '../prisma/prisma.service';

import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}
  async create(createPostDto: CreatePostDto, request: Request) {
    const author = await this.authService.validateUser(request);

    return this.prismaService.post.create({
      data: {
        ...createPostDto,
        authorId: author.id,
      },
    });
  }

  async findAll() {
    return this.prismaService.post.findMany({
      where: { published: true },
    });
  }

  findOne(id: number) {
    return this.prismaService.post.findUnique({ where: { id } });
  }

  async update(id: number, updatePostDto: UpdatePostDto, request: Request) {
    const existingPost = await this.prismaService.post.findUnique({
      where: { id },
    });
    const author = await this.authService.validateUser(request);

    if (!existingPost) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (author.id !== existingPost.authorId) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
    const imageUrl = updatePostDto.imageUrl || existingPost.imageUrl;

    return this.prismaService.post.update({
      where: { id },
      data: { ...updatePostDto, imageUrl },
    });
  }

  remove(id: number) {
    return this.prismaService.post.delete({ where: { id } });
  }
}
