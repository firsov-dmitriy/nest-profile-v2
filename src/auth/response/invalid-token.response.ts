import { ApiProperty } from '@nestjs/swagger';

export enum ErrorCode {
  EXPIRED = 'EXPIRED', // для истекшего токена
  INVALID = 'INVALID', // для невалидного токена
}

export class InvalidTokenResponse {
  @ApiProperty({
    enum: ErrorCode,
    example: ErrorCode.INVALID,
    description: 'The error code for the token status.',
    enumName: 'InvalidTokenResponseEnum',
  })
  public message?: ErrorCode;

  @ApiProperty({ type: String, description: 'Description of the error.' })
  public description?: string;
}
