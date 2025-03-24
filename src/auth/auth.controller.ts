import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ResetPasswordAuth,
  ResetPasswordConfirmAuth,
} from './dto/reset-password-auth';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpResponse } from './response/sign-up.response';
import { SignInResponse } from './response/sign-in.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: SignUpResponse,
    description: 'Welcome! You registration',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Post('sign-up')
  create(@Body() createAuthDto: RegisterAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: SignInResponse,
    description: 'Welcome!',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
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
