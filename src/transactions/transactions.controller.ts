import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /*to create a new transaction it will first go through
   a handler method to determine if a monthly record already exists and create it if it does not. */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() Dto: CreateTransactionDto,
    @GetUser() user: User) {
    return await this.transactionsService.handleMonthlyRegisterAndTransactions(Dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':monthCode')
  async findAllByUserAndMonthCode(
    @Param('monthCode') monthCode: string,
    @GetUser() user: User) {
    return await this.transactionsService.findAllByUserAndMonthCode(monthCode, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
