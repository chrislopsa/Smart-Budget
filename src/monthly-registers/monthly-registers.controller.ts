import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonthlyRegistersService } from './monthly-registers.service';
import { CreateMonthlyRegisterDto } from './dto/create-monthly-register.dto';
import { UpdateMonthlyRegisterDto } from './dto/update-monthly-register.dto';

@Controller('monthly-registers')
export class MonthlyRegistersController {
  constructor(private readonly monthlyRegistersService: MonthlyRegistersService) {}

  @Post()
  create(@Body() createMonthlyRegisterDto: CreateMonthlyRegisterDto) {
    //return this.monthlyRegistersService.create(createMonthlyRegisterDto);
  }

  @Get()
  findAll() {
    return this.monthlyRegistersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //return this.monthlyRegistersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonthlyRegisterDto: UpdateMonthlyRegisterDto) {
    //return this.monthlyRegistersService.update(+id, updateMonthlyRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monthlyRegistersService.remove(+id);
  }
}
