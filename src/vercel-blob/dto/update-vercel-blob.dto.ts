import { PartialType } from '@nestjs/swagger';
import { CreateVercelBlobDto } from './create-vercel-blob.dto';

export class UpdateVercelBlobDto extends PartialType(CreateVercelBlobDto) {}
