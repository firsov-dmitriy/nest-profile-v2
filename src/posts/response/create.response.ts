import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';

class CreatePostResponseData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  imageUrl: Express.Multer.File;
}

export class CreatePostResponse {
  @ApiProperty()
  data: CreatePostResponseData;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
