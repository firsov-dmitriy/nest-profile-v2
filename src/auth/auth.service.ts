import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordAuth } from './dto/reset-password-auth';
import { User } from './entities/auth.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { checkPassword, cryptPassword } from './utils';
import { JwtService } from '@nestjs/jwt';
import nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private usersRepository: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const user = await this.usersRepository.find({
      email: registerAuthDto.email,
    });
    if (user.length === 0) {
      const password = await cryptPassword(registerAuthDto.password);
      const createdUser = await this.usersRepository.create({
        ...registerAuthDto,
      });
      try {
        await this.usersRepository.create({ ...createdUser, password });
      } catch (err) {
        console.error(err);
      }

      return createdUser;
    }

    return 'This user already exists ';
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginAuthDto.email },
    });
    const isPasswordCorrect = await checkPassword(
      loginAuthDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }
    const payload = { name: user.name, id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async resetPassword({ email }: ResetPasswordAuth) {
    console.log('eee');
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: email,
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return 'test';
  }
}
