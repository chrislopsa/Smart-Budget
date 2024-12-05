import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonthlyRegisterDto } from './dto/create-monthly-register.dto';
import { UpdateMonthlyRegisterDto } from './dto/update-monthly-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MonthlyRegister } from './entities/monthly-register.entity';
import { Repository } from 'typeorm';
import { TypeTransaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class MonthlyRegistersService {
  constructor(
    @InjectRepository(MonthlyRegister)
    private readonly monthlyRegisterRepository : Repository<MonthlyRegister>
  ){}
  
  /*method to create a new monthly register, not from an endpoint but when the user creates a new transaction.
  note: monthly registers are the sum of all transactions recorded by a user in a calendar month.*/ 
  async create(
    userId: string,
    monthCode: string,
    amount: number,
    typeTransaction: TypeTransaction,
  ) {
    try {
      const newMonthlyRegister = this.monthlyRegisterRepository.create({
        user: {id: userId},
        month_code: monthCode,
        total_incomes: typeTransaction === 'income' ? amount : 0,
        total_expenses: typeTransaction === 'expense' ? amount : 0,
      }
      );
      return await this.monthlyRegisterRepository.save(newMonthlyRegister); 
    } catch (error) {
      throw new HttpException(
        error.message || "Error Saving Monthly Register in BD",
        error.status || 500
      );
    }
  }

  /**method to update the values of the fields 'total_incomes' and 'total_expenses',
   *  from the creation, update or deletion of a transaction by the user. */
  async update(id: string, amount: number, typeTransaction: TypeTransaction) {
    try {
      const monthlyRegister: MonthlyRegister = await this.findOne(id);

      if(typeTransaction === 'income') monthlyRegister.total_incomes += amount;

      if(typeTransaction === 'expense') monthlyRegister.total_expenses += amount;

      return await this.monthlyRegisterRepository.save(monthlyRegister);
    } catch (error) {
      throw new HttpException(
        error.message || "Error Updating Monthly Register in BD",
        error.status || 500
      );
    }
  }

  findAll() {
    return `This action returns all monthlyRegisters`;
  }

  async findOne(id: string) {
    try {
      const monthlyRegister: MonthlyRegister = await this.monthlyRegisterRepository.findOne({where: {id}});

        if (!monthlyRegister) throw new NotFoundException("Monthly register not found");
        return monthlyRegister;

    } catch (error) {
      throw new HttpException(
        error.message || "Error founding monthly register in BD",
        error.status || 500
      )
    }
  }

  async findOneByUserAndMonthCode(userId: string, monthCode: string) {
    try {
      return await this.monthlyRegisterRepository.findOne({
        where: {
          user: { id: userId },
          month_code: monthCode,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.message || "Error founding monthly register in BD",
        error.status || 500
      )
    }
  }

  remove(id: number) {
    return `This action removes a #${id} monthlyRegister`;
  }

}
