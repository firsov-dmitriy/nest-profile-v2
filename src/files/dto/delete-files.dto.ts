import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class DeleteFilesDto {
  @ApiProperty({ type: String })
  @IsUrl()
  url: string;
}
