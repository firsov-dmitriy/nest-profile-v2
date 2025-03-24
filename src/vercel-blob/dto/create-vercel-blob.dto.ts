import { ApiProperty } from '@nestjs/swagger';

export class CreateVercelBlobDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
