import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { TypeTransaction } from 'src/transactions/entities/transaction.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User): Promise<BaseResponseDto> {
    const newCategory = await this.categoriesService.create(createCategoryDto, user.id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Category successfully created',
      data: newCategory.name
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':type')
  async findAllByUserAndType(
    @Param('type') type: TypeTransaction,
    @GetUser() user: User): Promise<BaseResponseDto> {
      const categories: Category[] = await this.categoriesService.findAllByUserAndType(user.id, type);
      return {
        statusCode: HttpStatus.FOUND,
        message: 'Categories successfully found',
        data: categories
      };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser() user: User): Promise<BaseResponseDto> {
    const category: Category = await this.categoriesService.remove(id, user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Category successfully deleted',
      data: category.name
    };
  }
}
