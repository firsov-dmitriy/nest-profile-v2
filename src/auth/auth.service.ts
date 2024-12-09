import { Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private usersRepository: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
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

      return { ...registerAuthDto, ...tokens };
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
    if (!isPasswordCorrect) throw new UnauthorizedException();
    const payload = { ...user, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
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
}
