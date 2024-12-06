import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { TypeTransaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class CategoriesService {
constructor(
  @InjectRepository(Category)
   private readonly categoryRepository: Repository<Category>,
){}

  async create(Dto: CreateCategoryDto) {
    try {
      const categoryFound = await this.findOneByNameByTypeAndUser(
        Dto.name,
        Dto.type,
        Dto.user_id);
      if(categoryFound) throw new BadRequestException("La categoría ya existe");

      const newCategory: Category = this.categoryRepository.create(Dto);
      return await this.categoryRepository.save(newCategory);

    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findAll() {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOne(id: string) {
    try {
      return await this.categoryRepository.findOne({
        where: {id}
      });
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findAllByUser(userId: string) {
    try {
      return await this.categoryRepository.find({
        where: {
          user: { id: userId }
        }, 
      });
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOneByNameByTypeAndUser(name: string, type: TypeTransaction, userId: string) {
    try {
      return await this.categoryRepository.findOne({
        where: {
          user: {id: userId},
          name: name,
          type: type
        }, 
      });
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOneByType(type: TypeTransaction) {
    try {
      return await this.categoryRepository.findOne({
        where: {
          type: type
        }, 
      });
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOneByIdAndUser(id: string, userId: string) {
    try {
      return await this.categoryRepository.findOne({
        where: {
          id: id,
          user: {id: userId}
        }, 
      });
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async remove(id: string){
    const category: Category = await this.findOne(id);

    if(!category) throw new NotFoundException('Categoría no encontrada')

    return await this.categoryRepository.softRemove(category);
  }
}
