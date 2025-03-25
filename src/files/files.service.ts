import { Injectable, NotFoundException } from '@nestjs/common';
import { del, list, put } from '@vercel/blob';

@Injectable()
export class FilesService {
  async create(file: Express.Multer.File) {
    return await put(file.originalname, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  }

  findAll() {
    return list({ token: process.env.BLOB_READ_WRITE_TOKEN });
  }

  async remove(url: string) {
    const list = await this.findAll();
    if (!list.blobs.find((file) => file.url === url)) {
      throw new NotFoundException(`File not found`);
    }

    await del(url);
    return 'OK';
  }
}
