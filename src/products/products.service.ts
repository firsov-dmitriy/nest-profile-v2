import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../auth/token.service';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}
  async create(createProductDto: CreateProductDto, request: Request) {
    const author = await this.authService.validateUser(request);

    return this.prismaService.product.create({
      data: { ...createProductDto, authorId: author.id },
    });
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  findOne(id: number) {
    return this.prismaService.product.findUnique({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prismaService.post.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prismaService.product.delete({ where: { id } });
  }
}
