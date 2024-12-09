import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export class RegisterAuthDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public middleName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  @IsOptional()
  public role?: Role;
}
