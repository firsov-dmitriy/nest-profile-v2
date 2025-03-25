import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export class RegisterAuthDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  public firstName: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  public middleName: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
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

  @ApiPropertyOptional({ enum: [Role.USER, Role.ADMIN], enumName: 'Role' })
  public role?: Role;
}
