import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TokenService } from './token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private usersRepository: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUserPrisma = await this.prisma.user.findUnique({
      where: { email: registerAuthDto.email },
    });

    if (!existingUserPrisma) {
      const password = await this.cryptPassword(registerAuthDto.password);

      const createdUser = await this.prisma.user.create({
        data: {
          ...registerAuthDto,
          password: password,
        },
      });

      const tokens = await this.getTokens(
        createdUser.id,
        registerAuthDto.email,
      );
      await this.updateRefreshToken({
        ...createdUser,
        accessToken: tokens.accessToken,
      });
      const userWithoutPassword = Object.assign({}, createdUser);
      delete userWithoutPassword.password;
      return { ...userWithoutPassword, ...tokens };
    }

    return 'This user already exists';
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.email },
    });
    const isPasswordCorrect = await this.checkPassword(
      loginAuthDto.password,
      user.password,
    );
    if (!isPasswordCorrect)
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND, {
        description: 'Не верный пароль или емайл',
      });

    const tokens = await this.getTokens(user.id, user.email);

    return { ...tokens };
  }

  async resetPassword({ email }: ResetPasswordAuth) {
    const salt = await genSalt();
    const hashed = await hash(email, salt);
    try {
      await this.usersRepository.findOneAndUpdate(
        { email },
        {
          restorePasswordHash: hashed,
        },
      );
    } catch (error) {
      throw new Error(error);
    }

    return email;
  }
  private async cryptPassword(password: string) {
    const salt = await genSalt();
    return hashSync(password, salt);
  }

  private async checkPassword(password: string, hash: string) {
    return await compare(password, hash);
  }
  private async getTokens(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { userId, email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId, email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  async resetPasswordConfirm({
    email,
    password,
    hash,
  }: ResetPasswordConfirmAuth) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) return 'User not found';
    const isHashEqual = user.restorePasswordHash === hash;
    if (isHashEqual) {
      try {
        return await this.usersRepository.findByIdAndUpdate(user.id, {
          password: await this.cryptPassword(password),
          restorePasswordHash: '',
        });
      } catch (e) {
        throw new Error(e);
      }
    }
  }

  private async updateRefreshToken(data: Prisma.UserUpdateInput) {
    await this.prisma.user.update({
      where: { id: data.id as string },
      data: data,
    });
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
