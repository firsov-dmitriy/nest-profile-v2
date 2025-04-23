import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class UnauthorizedResponse {
  @ApiProperty({ type: String, example: 'Unauthorized' })
  public message?: string;

  @ApiProperty({ enum: HttpStatus, example: HttpStatus.UNAUTHORIZED })
  public statusCode?: HttpStatus.UNAUTHORIZED;
}
