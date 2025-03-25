import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';

export class CreatePostResponseData {
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
  imageUrl: string;
}

export class CreatePostResponse {
  @ApiProperty()
  data: CreatePostResponseData;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
