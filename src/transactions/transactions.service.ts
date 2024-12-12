import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TypeTransaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { MonthlyRegistersService } from 'src/monthly-registers/monthly-registers.service';
import { MonthlyRegister } from 'src/monthly-registers/entities/monthly-register.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
     private readonly transactionsRepository: Repository<Transaction>,
     private readonly monthlyRegistersService: MonthlyRegistersService,
     private readonly categoriesService: CategoriesService,
  ){}

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
    monthCode: string): Promise<Transaction> {
      try {
      const newTransaction: Transaction = this.transactionsRepository.create({
        ...createTransactionDto,
        user_id: userId,
        month_code: monthCode
      })
        return await this.transactionsRepository.save(newTransaction)

      } catch (error) {
        throw new InternalServerErrorException('Internal server error');
      }
  }

  async findAllByUserAndMonthCode(month_code: string, userId: string): Promise<Transaction[]> {
    const transactions = await this.transactionsRepository.find({
      where:{
        user: {id: userId},
        month_code: month_code
      }
    });
    if(!transactions) throw new NotFoundException('Transactions not found');
    return transactions;
  }

  async remove(id: string, userId: string): Promise<Transaction> {
    try {
      const transactionFound: Transaction = await this.findOneByIdAndUser(id, userId);
      const { month_code, type } = transactionFound;
      const amount: number = (transactionFound.amount * -1) 
      //is multiplied by -1 so that when the monthly record is updated, it is subtracted from the total.
      console.log('amount', amount);
      
      if(!transactionFound) throw new UnauthorizedException('Unauthorized');

      const transactionRemoved = await this.transactionsRepository.softRemove(transactionFound);

      //find the corresponding monthly register to update it.
      let monthlyRegister: MonthlyRegister = await this.monthlyRegistersService.findOneByUserAndMonthCode(
        userId,
        month_code
      )
      if(monthlyRegister) {
        monthlyRegister = await this.monthlyRegistersService.update(
          monthlyRegister.id,
          amount,
          type
        )
      }
      return transactionRemoved;

    } catch (error) {
      if(error instanceof UnauthorizedException) throw new UnauthorizedException(error.message);

      throw new InternalServerErrorException('Internal server error');
    }
  }

  async handleMonthlyRegisterAndTransactions(
    createTransactionDto: CreateTransactionDto,
    userId: string) {
    try {
      const { category_id, type, amount } = createTransactionDto;
      const categoryFound: Category = await this.categoriesService.findOneByIdAndUser(
        category_id,
        userId);
        
      if(!categoryFound) throw new NotFoundException("The category associated with the user does not exist");
  
      if(categoryFound.type !== type){
        throw new BadRequestException('category type and transaction type must be the same');
      } 
  
      const currentDate = dayjs().utc().startOf('day');
      const monthCode: string = currentDate.format('YYYY-MM');
   
      //check if a monthly register already exists:
      let monthlyRegister: MonthlyRegister = await this.monthlyRegistersService.findOneByUserAndMonthCode(
        userId,
        monthCode);
      
      //create a monthly register if one does not exist
      if(!monthlyRegister){
        monthlyRegister = await this.monthlyRegistersService.create(
          userId,
          monthCode,
        );
      }
  
      //create transaction
      const newTransaction: Transaction = await this.create(createTransactionDto, userId, monthCode)
  
      monthlyRegister = await this.monthlyRegistersService.update(
          monthlyRegister.id,
          amount,
          type
        );
        return newTransaction;

    } catch (error) {
      if(error instanceof NotFoundException) throw new NotFoundException(error.message);

      if(error instanceof BadRequestException) throw new BadRequestException(error.message);

      throw new InternalServerErrorException('Internal server error');
    }
  }

  async findOneByIdAndUser(id: string, userId: string): Promise<Transaction> {
    try {
      return await this.transactionsRepository.findOne({
        where: {
          id: id,
          user: {id: userId}
        }, 
      });
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async update(
    id: string,
    userId: string,
    updatetransactionDto: UpdateTransactionDto): Promise<Transaction> {
    try {
      const transactionFound: Transaction = await this.findOneByIdAndUser(id, userId);
      
      if(!transactionFound) throw new UnauthorizedException('Unauthorized');
    
      /*if the amount of the transaction will be updated, 
        update also  the monthly register*/
      if(updatetransactionDto.amount) {
        const newAmount: number = updatetransactionDto.amount;
        const oldAmount: number = transactionFound.amount;
        const amountDifference: number =  newAmount - oldAmount;

        const { month_code, type } = transactionFound;
        let monthlyRegister: MonthlyRegister = await this.monthlyRegistersService.findOneByUserAndMonthCode(
          userId,
          month_code
        );
       
        if(monthlyRegister) {
          monthlyRegister = await this.monthlyRegistersService.update(
            monthlyRegister.id,
            amountDifference,
            type
          );
        }
      }
      //update transaction
      let transactionUpdated = Object.assign(transactionFound, updatetransactionDto);
      transactionUpdated = await this.transactionsRepository.save(transactionUpdated);
      return transactionUpdated;

    } catch (error) {
      if(error instanceof UnauthorizedException) throw new UnauthorizedException(error.message);

      throw new InternalServerErrorException('Internal server error');
    }
  }
}
