import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserExistsGuard } from 'src/common/guards/user-exists.guard';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /*to create a new transaction it will first go through
   a handler method to determine if a monthly record already exists and create it if it does not. */
  @Post()
  @UseGuards(UserExistsGuard)
  create(@Body() Dto: CreateTransactionDto) {
    return this.transactionsService.handleMonthlyRegisterAndTransactions(Dto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
