import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({ type: Boolean, example: true })
  public success: boolean;
}

export enum ErrorCode {
  EXPIRED = 'EXPIRED', // для истекшего токена
  INVALID = 'INVALID', // для невалидного токена
}
