import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ){}

  async create(user: RegisterUserDto) {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOne({ where: {id} });
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userRepository.findOne({ where: {email} });
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
