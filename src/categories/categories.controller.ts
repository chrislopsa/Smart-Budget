import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { TypeTransaction } from 'src/transactions/entities/transaction.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User) {
    return await this.categoriesService.create(createCategoryDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':type')
  async findAllByUserAndType(
    @Param('type') type: TypeTransaction,
    @GetUser() user: User){
    return await this.categoriesService.findAllByUserAndType(user.id, type);
  }

  @Delete()
  async remove(@Body() id: string) {
    return await this.categoriesService.remove(id);
  }
}
