import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ProductsResponse } from './response/products.response';
import { AuthGuard } from '../auth/auth.guard';
import { ProductResponse } from './response/product.response';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created product',
    type: ProductResponse,
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productsService.create(createProductDto, req);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Products list',
    type: ProductsResponse,
  })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Edit product',
    type: ProductResponse,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
  ) {
    return this.productsService.update(+id, updateProductDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
