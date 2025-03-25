import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Version,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { FilesService } from './files.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileUploadResponse } from './response/file-upload.response';
import { DeleteFilesDto } from './dto/delete-files.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Version('1')
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileUploadResponse,
    description: 'File uploaded',
  })
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.create(file);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FileUploadResponse,
    description: 'File uploaded',
  })
  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Post('delete')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File deleted',
  })
  remove(@Body() deleteFilesDto: DeleteFilesDto) {
    return this.filesService.remove(deleteFilesDto.url);
  }
}
