import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export class RegisterAuthDto {
  @ApiPropertyOptional({ type: String })
  public firstName?: string;

  @ApiPropertyOptional({ type: String })
  public middleName?: string;

  @ApiPropertyOptional({ type: String })
  public lastName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiPropertyOptional({ enum: [Role.USER, Role.ADMIN], enumName: 'Role' })
  public role?: Role;
}
