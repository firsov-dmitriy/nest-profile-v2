import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { cryptPassword } from './utils';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findBy({
      email: createUserDto.email,
    });
    if (user.length === 0) {
      const password = await cryptPassword(createUserDto.password);
      const createdUser = await this.usersRepository.create({
        ...createUserDto,
      });
      try {
        await this.usersRepository.insert({ ...createdUser, password });
      } catch (err) {
        console.error(err);
      }

      return createdUser;
    }

    return 'This user already exists ';
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
    const user = await this.usersRepository.findOne({ where: { id } });

    if (user) {
      const password = await cryptPassword(updateUserDto.password);
      const createdUser = await this.usersRepository.create({
        ...updateUserDto,
      });
      try {
        await this.usersRepository.update(user.id, {
          ...updateUserDto,
          password,
        });
      } catch (err) {
        console.error(err);
      }

      return createdUser;
    }
    return 'User not found';
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
