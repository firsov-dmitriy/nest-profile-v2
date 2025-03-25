import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';

class FileUploadResponseData {
  @ApiProperty({ type: String, example: 'https://image.jpg' })
  url: string;

  @ApiProperty({
    type: String,
    description: 'Url to download',
    example: 'https://image.jpg"',
  })
  downloadUrl: string;

  @ApiProperty({ type: String })
  pathname: string;

  @ApiProperty({ type: String })
  contentType: string;

  @ApiProperty({ type: String })
  contentDisposition: string;
}

export class FileUploadResponse {
  @ApiProperty({ type: [FileUploadResponseData] })
  data: FileUploadResponseData;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
