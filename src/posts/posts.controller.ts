import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CommonResponseSchema } from '../types/DataType';
import { CreatePostResponse } from './response/create.response';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreatePostResponse,
    description: 'Created Post',
  })
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create(createPostDto, req);
  }

  @ApiOkResponse({
    status: 200,
    description: 'Posts list',
    schema: CommonResponseSchema(UpdatePostDto),
  })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    type: CreatePostResponse,
    description: 'Updated Post',
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
