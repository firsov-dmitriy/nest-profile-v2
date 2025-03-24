import { Module } from '@nestjs/common';
import { VercelBlobService } from './vercel-blob.service';
import { VercelBlobController } from './vercel-blob.controller';

@Module({
  controllers: [VercelBlobController],
  providers: [VercelBlobService],
  exports: [VercelBlobService],
})
export class VercelBlobModule {}
