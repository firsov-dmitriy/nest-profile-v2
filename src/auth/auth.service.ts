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
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private usersRepository: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    // Check if user exists with given email
    const existingUser = await this.usersRepository.findOne({
      email: registerAuthDto.email,
    });

    // If user does not exist, create a new user
    if (!existingUser) {
      const password = await this.cryptPassword(registerAuthDto.password);

      const salt = await genSalt();
      const hash = hashSync(registerAuthDto.email, salt);
      const href = `https://react-redux-movie.vercel.app/confirm-password?hash=${hash}&email=${registerAuthDto.email}`;
      const newUser: User = {
        ...registerAuthDto,
        password,
        confirmed: false,
        confirmedHash: hash,
      };
      const createdUser = await this.usersRepository.create(newUser);

      // Get tokens and update refresh token
      const tokens = await this.getTokens(createdUser.id, registerAuthDto.name);
      await this.updateRefreshToken(createdUser.id, tokens.refreshToken);

      // Generate hash and send confirmation email

      const emailOptions = {
        to: createdUser.email,
        from: 'no-replay@firsov.com',
        subject: 'Password confirmed',
        text: 'Password confirmed!',
        html: `<b><a href=${href}>Для подтверждения пароля перейдите по ссылке!</a></b>`,
      };
      await this.mailerService.sendMail(emailOptions);

      // Return user details and tokens
      return { name: createdUser.name, email: createdUser.email, ...tokens };
    }

    // Return message if user already exists
    return 'This user already exists';
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersRepository.findOne({
      email: loginAuthDto.email,
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
      await this.mailerService.sendMail({
        to: email,
        from: 'no-replay@firsov.com',
        subject: 'Password Reset',
        text: 'You try to reset password!',
        html: `<b><a href=${href}>Перейдите по ссылке для восстановления пароля!</a></b>`,
      });
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

  private async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersRepository.findByIdAndUpdate(userId, { refreshToken });
  }
}
