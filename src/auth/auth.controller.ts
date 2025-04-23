import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  HttpStatus,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
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
import { UnauthorizedResponse } from './response/unauthorized.response';
import { Public } from '../public/decorator';
import { SuccessResponse } from './response/successResponse';
import { InvalidTokenResponse } from './response/invalid-token.response';

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
  @Public()
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginAuthDto, res);
  }
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: SignUpResponse,
    description: 'Welcome! You registration',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UnauthorizedResponse,
    description: 'Unauthorized',
  })
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('refresh')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: InvalidTokenResponse,
    description: 'Expired refresh token',
  })
  async refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res);
  }
  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponse,
  })
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
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
