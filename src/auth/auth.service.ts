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

      const salt = await genSalt();
      const hash = hashSync(registerAuthDto.email, salt);
      const newUser: User = {
        ...registerAuthDto,
        password,
        confirmed: false,
        confirmedHash: hash,
      };
      const createdUser = await this.prisma.user.create({
        data: {
          name: registerAuthDto.name,
          email: registerAuthDto.email,
          password: password,
        },
      });

      const tokens = await this.getTokens(createdUser.id, registerAuthDto.name);
      await this.updateRefreshToken({
        ...createdUser,
        accessToken: tokens.accessToken,
      });

      return { name: createdUser.name, email: createdUser.email, ...tokens };
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
    const payload = { name: user.name, sub: user.id, email: user.email };
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

      const href = `https://react-redux-movie.vercel.app/confirm-password?hash=${hashed}&email=${email}`;
      // await this.mailerService.sendMail({
      //   to: email,
      //   from: 'no-replay@firsov.com',
      //   subject: 'Password Reset',
      //   text: 'You try to reset password!',
      //   html: `<b><a href=${href}>Перейдите по ссылке для восстановления пароля!</a></b>`,
      // });
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
  private async getTokens(userId: string, username: string) {
    const accessToken = await this.jwtService.signAsync(
      { userId, username },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId, username },
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
