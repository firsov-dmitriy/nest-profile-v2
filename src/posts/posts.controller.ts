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
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreatePostResponse } from './response/create-posts.response';
import { GetPostResponse } from './response/get-posts.response';
import { GetInfoPostResponse } from './response/get-info-posts.response';

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
    type: GetPostResponse,
  })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }
  @ApiOkResponse({
    status: 200,
    description: 'Posts Info',
    type: GetInfoPostResponse,
  })
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
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    return this.postsService.update(+id, updatePostDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
