import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

import { TokenService } from '../auth/token.service';
import { Request } from 'express';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}
  async create(createPostDto: CreatePostDto, request: Request) {
    const accessToken = this.tokenService.extractTokenFromHeader(request);
    const payload = this.jwtService.decode(accessToken) as { email: string };
    const email = payload.email;
    const author = await this.prismaService.user.findUnique({
      where: { email },
    });
    return this.prismaService.post.create({
      data: { ...createPostDto, authorId: author.id },
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
