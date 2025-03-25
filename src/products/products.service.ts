import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
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

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    request: Request,
  ) {
    const existingProduct = await this.prismaService.product.findUnique({
      where: { id },
    });
    const author = await this.authService.validateUser(request);
    if (!existingProduct) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    if (author.id !== existingProduct.authorId) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prismaService.product.delete({ where: { id } });
  }
}
