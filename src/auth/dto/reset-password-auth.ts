import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordAuth {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}

export class ResetPasswordConfirmAuth extends ResetPasswordAuth {
  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsNotEmpty()
  public hash: string;
}
