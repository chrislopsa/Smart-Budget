import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonthlyRegistersService } from './monthly-registers.service';


@Controller('monthly-registers')
export class MonthlyRegistersController {
  constructor(private readonly monthlyRegistersService: MonthlyRegistersService) {}


  @Get(':userId')
  async findAllByUser(@Param('userId') userId: string){
    return await this.monthlyRegistersService.findAllByUser(userId);
  }

  @Get(':userId/:monthCode')
  async findOneByUserAndMonthCode(
    @Param('userId') userId: string, 
    @Param('monthCode') monthCode: string) {
    return await this.monthlyRegistersService.findOneByUserAndMonthCode(userId, monthCode);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monthlyRegistersService.remove(+id);
  }
}
