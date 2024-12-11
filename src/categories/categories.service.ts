import { ConflictException,
          Injectable,
          InternalServerErrorException,
          NotFoundException, 
          UnauthorizedException} from '@nestjs/common';
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

  async create(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category> {
    try {
      const {name, type} = createCategoryDto;

      const existingCategory: Category = await this.categoryRepository.findOne({
        where: {
          user: {id: userId},
          name: name,
          type: type
        }, 
      });
      if(existingCategory) throw new ConflictException("The category already exists");

      const newCategory: Category = this.categoryRepository.create({
        ...createCategoryDto,
        user_id: userId
      });
      return await this.categoryRepository.save(newCategory);

    } catch (error) {
      if(error instanceof ConflictException) throw new ConflictException(error.message);

      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category: Category = await this.categoryRepository.findOne({
        where: {id}
      });
      if(!category) throw new NotFoundException('Category not found');
      return category;

    } catch (error) {
      if(error instanceof NotFoundException) throw new NotFoundException(error.message);

      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findAllByUserAndType(userId: string, type: TypeTransaction): Promise<Category[]> {
    try {
      const categories: Category[] = await this.categoryRepository.find({
        where: {
          user: { id: userId },
          type: type
        }, 
      });
      if(categories.length === 0) throw new NotFoundException(`User has no ${type} type categories`);
      return categories;

    } catch (error) {
      if(error instanceof NotFoundException) throw new NotFoundException(error.message);

      throw new InternalServerErrorException('Internal server error');
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
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async remove(id: string, userId: string): Promise<Category>{
    try {
      const category: Category = await this.findOneByIdAndUser(id, userId);

      if(!category) throw new UnauthorizedException('Unauthorized');

      return await this.categoryRepository.softRemove(category);
    } catch (error) {
      if(error instanceof UnauthorizedException) throw new UnauthorizedException(error.message);

      throw new InternalServerErrorException('Internal server error');
    }
  }
}
