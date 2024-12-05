import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { TypeTransaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class CategoriesService {
constructor(
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
){}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new HttpException(
        error.message || "Error saving Category in DB ",
        error.status || 500
      );
    }
  }

  async findAll() {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      throw new HttpException(
        error.message || "Error founding Categories in DB ",
        error.status || 404
      );
    }
  }

  async findOneByUser(userId: string) {
    try {
      return await this.categoryRepository.findOne({
        where: {
          user: { id: userId }
        }, 
      });
    } catch (error) {
      throw new HttpException(
        error.message || "Error founding category in BD",
        error.status || 500
      )
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
      throw new HttpException(
        error.message || "Error founding category in BD",
        error.status || 500
      )
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
      throw new HttpException(
        error.message || "Error founding category in BD",
        error.status || 500
      )
    }
  }
  
  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
