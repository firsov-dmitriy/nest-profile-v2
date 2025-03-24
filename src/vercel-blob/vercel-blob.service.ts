import { Injectable } from '@nestjs/common';
import { del, list, put } from '@vercel/blob';

@Injectable()
export class VercelBlobService {
  async create(file: Express.Multer.File) {
    console.log(file);
    return await put(file.originalname, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  }

  findAll() {
    return list({ token: process.env.BLOB_READ_WRITE_TOKEN });
  }

  async remove(url: string) {
    console.log(del(url));
    return await del(url);
  }
}
