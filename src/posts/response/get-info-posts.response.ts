import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';
import { CreatePostResponseData } from './create-posts.response';

export class GetInfoPostResponse {
  @ApiProperty({ type: CreatePostResponseData })
  data: CreatePostResponseData;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
