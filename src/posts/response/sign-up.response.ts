import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
class SignUpResponseData {
  @ApiProperty({ type: String, example: 'Name' })
  public firstName?: string;

  @ApiProperty({ type: String, example: 'Name' })
  public middleName?: string;

  @ApiProperty({ type: String, example: 'Name' })
  public lastName?: string;

  @ApiProperty({ type: String, example: 'test@test.com' })
  public email: string;

  @ApiProperty()
  public password: string;

  @ApiProperty({ enum: [Role.USER, Role.ADMIN], enumName: 'Role' })
  public role?: Role;

  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;
}

export class SignUpResponse {
  @ApiProperty()
  data: SignUpResponseData;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
