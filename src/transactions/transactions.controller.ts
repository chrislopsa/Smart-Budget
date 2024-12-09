import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserExistsGuard } from 'src/common/guards/user-exists.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /*to create a new transaction it will first go through
   a handler method to determine if a monthly record already exists and create it if it does not. */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() Dto: CreateTransactionDto, @GetUser() user: User) {
    console.log(user);
    return this.transactionsService.handleMonthlyRegisterAndTransactions(Dto, user.id)
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
