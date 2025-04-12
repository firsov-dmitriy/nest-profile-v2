import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ResetPasswordAuth,
  ResetPasswordConfirmAuth,
} from './dto/reset-password-auth';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpResponse } from './response/sign-up.response';
import { SignInResponse } from './response/sign-in.response';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResponse({
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
    console.log(createAuthDto);
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
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignUpResponse,
    description: 'Welcome! You registration',
  })
  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.getProfile(req);
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
