import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Version,
} from '@nestjs/common';
import { VercelBlobService } from './vercel-blob.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
@ApiTags('VercelBlob')
@Controller('vercel-blob')
export class VercelBlobController {
  constructor(private readonly vercelBlobService: VercelBlobService) {}

  @Version('1')
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.vercelBlobService.create(file);
  }

  @Get()
  findAll() {
    return this.vercelBlobService.findAll();
  }

  @Delete(':url')
  remove(@Param('url') url: string) {
    return this.vercelBlobService.remove(url);
  }
}
