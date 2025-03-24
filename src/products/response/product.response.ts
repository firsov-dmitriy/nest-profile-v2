import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';

class ProductResponseData {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Boolean })
  published: boolean;

  @ApiProperty({ type: String })
  authorId: string;
}

export class ProductResponse {
  @ApiProperty()
  data: ProductResponseData;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
