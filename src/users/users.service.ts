import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { cryptPassword } from './utils';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return 'tt';
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    console.log(user);

    if (user) return user;
    return 'User not found';
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return 'ttt';
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
