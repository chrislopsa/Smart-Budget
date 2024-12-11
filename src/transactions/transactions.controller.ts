import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus, Patch } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';


@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /*to create a new transaction it will first go through
   a handler method to determine if a monthly register already exists and create it if it does not. */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() CreateTransactionDto: CreateTransactionDto,
    @GetUser() user: User): Promise<BaseResponseDto> {
      const newTransactionAndMonthlyRegister = await this.transactionsService.handleMonthlyRegisterAndTransactions(
        CreateTransactionDto,
        user.id);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Transaction successfully created',
        data: newTransactionAndMonthlyRegister
      }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':monthCode')
  async findAllByUserAndMonthCode(
    @Param('monthCode') monthCode: string,
    @GetUser() user: User): Promise<BaseResponseDto> {
    const transactions = await this.transactionsService.findAllByUserAndMonthCode(monthCode, user.id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Transactions successfully found',
      data: transactions
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @GetUser() user: User): Promise<BaseResponseDto> {
    const transactionRemoved = await this.transactionsService.remove(id, user.id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Transactions successfully found',
      data: transactionRemoved
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updatetransactionDto: UpdateTransactionDto
  ): Promise<BaseResponseDto> {
    const transactionUpdated = await this.transactionsService.update(id, user.id, updatetransactionDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Transactions successfully found',
      data: transactionUpdated
    }
  }
}
