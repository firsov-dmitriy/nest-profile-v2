import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ResetPasswordAuth,
  ResetPasswordConfirmAuth,
} from './dto/reset-password-auth';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  create(@Body() createAuthDto: RegisterAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @Post('sign-in')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordAuthDto: ResetPasswordAuth) {
    return this.authService.resetPassword(resetPasswordAuthDto);
  }
  @Patch('reset-password')
  resetPasswordConfirm(
    @Body() resetPasswordConfirmedDto: ResetPasswordConfirmAuth,
  ) {
    return this.authService.resetPasswordConfirm(resetPasswordConfirmedDto);
  }
}
