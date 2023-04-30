import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordAuth {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
