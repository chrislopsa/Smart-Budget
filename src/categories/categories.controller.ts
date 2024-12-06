import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserExistsGuard } from 'src/common/guards/user-exists.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(UserExistsGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('/userId/:userId')
  @UseGuards(UserExistsGuard)
  findAllByUser(@Param('userId') userId: string){
    return this.categoriesService.findAllByUser(userId);
  }

  @Delete()
  remove(@Body() id: string) {
    return this.categoriesService.remove(id);
  }
}
