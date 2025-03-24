import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  published: boolean;

  @ApiProperty({ type: 'string', format: 'uri' })
  @IsUrl()
  imageUrl: string;
}
