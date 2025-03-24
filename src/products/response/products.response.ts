import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';
import { ProductResponse } from './product.response';

export class ProductsResponse {
  @ApiProperty({ isArray: true })
  data: ProductResponse;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
