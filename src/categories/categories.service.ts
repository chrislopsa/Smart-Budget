import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
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

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    try {
      const {name, type} = createCategoryDto;
      const categoryFound = await this.findOneByNameByTypeAndUser(
        name,
        type,
        userId);
      if(categoryFound) throw new BadRequestException("La categoría ya existe");

      const newCategory: Category = this.categoryRepository.create({
        ...createCategoryDto,
        user_id: userId
      });
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

  async findAllByUserAndType(userId: string, type: TypeTransaction) {
    try {
      const categories = await this.categoryRepository.find({
        where: {
          user: { id: userId },
          type: type
        }, 
      });
      return categories;
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
