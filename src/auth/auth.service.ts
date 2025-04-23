import {
  HttpException,
  HttpStatus,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ResetPasswordAuth,
  ResetPasswordConfirmAuth,
} from './dto/reset-password-auth';
import { User } from './entities/auth.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, genSalt, hash, hashSync } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TokenService } from './token.service';
import { Request } from 'express';
import { JwtPayload } from '../types/JwtPayload';
import { ErrorCode } from './response/successResponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private usersRepository: Model<User>,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerAuthDto.email },
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const hashedPassword = await this.cryptPassword(registerAuthDto.password);

    const createdUser = await this.prisma.user.create({
      data: {
        ...registerAuthDto,
        password: hashedPassword,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        middleName: true,
        role: true,
      },
    });

    await this.updateRefreshToken(createdUser);

    return createdUser;
  }

  async login(
    loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.getUserByEmail(loginAuthDto.email);

    if (
      !user ||
      !(await this.checkPassword(loginAuthDto.password, user.password))
    ) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = await this.generateTokens(payload);

    this.tokenService.setAuthCookies(res, accessToken, refreshToken);
    return { success: true };
  }

  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException({
        message: ErrorCode.EXPIRED,
        description: 'Expired refresh token',
      });
    }

    const newTokens = await this.refreshTokens(refreshToken);
    this.tokenService.setAccessTokenCookie(res, newTokens.accessToken);
    return res.send({ success: true });
  }

  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.send({ success: true });
  }
  async resetPassword({ email }: ResetPasswordAuth) {
    const hashedEmail = await this.hashEmail(email);
    await this.updateRestorePasswordHash(email, hashedEmail);
    return email;
  }

  async resetPasswordConfirm({
    email,
    password,
    hash,
  }: ResetPasswordConfirmAuth) {
    const user = await this.usersRepository.findOne({ email });
    if (!user || user.restorePasswordHash !== hash) {
      throw new HttpException(
        'Invalid hash or user not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.cryptPassword(password);
    return this.usersRepository.findByIdAndUpdate(user.id, {
      password: hashedPassword,
      restorePasswordHash: '',
    });
  }

  private async cryptPassword(password: string) {
    const salt = await genSalt();
    return hashSync(password, salt);
  }

  private async checkPassword(password: string, hash: string) {
    return await compare(password, hash);
  }

  private async refreshTokens(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(payload);
    return { accessToken, refreshToken: newRefreshToken };
  }

  private async generateTokens(payload: JwtPayload) {
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  private async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  private async updateRefreshToken(user: Prisma.UserUpdateInput) {
    await this.prisma.user.update({
      where: { id: user.id as string },
      data: user,
    });
  }

  private async hashEmail(email: string) {
    const salt = await genSalt();
    return hash(email, salt);
  }

  private async updateRestorePasswordHash(email: string, hashed: string) {
    try {
      await this.usersRepository.findOneAndUpdate(
        { email },
        { restorePasswordHash: hashed },
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateUser(request: Request) {
    const accessToken = this.tokenService.extractTokenFromHeader(request);
    const payload = this.jwtService.decode(accessToken) as { email: string };
    if (!payload?.email) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
