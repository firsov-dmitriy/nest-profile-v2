import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from '../../types/DataType';

class SignInResponseData {
  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;
}

export class SignInResponse {
  @ApiProperty()
  data: SignInResponseData;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
