import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
  ): Promise<MonthlyRegister> {
    try {
      const newMonthlyRegister = this.monthlyRegisterRepository.create({
        user: {id: userId},
        month_code: monthCode,
        total_incomes: 0,
        total_expenses: 0,
      }
      );
      return await this.monthlyRegisterRepository.save(newMonthlyRegister); 
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  /**method to update the values of the fields 'total_incomes' and 'total_expenses',
   *  from the creation, update or deletion of a transaction by the user. */
  async update(
    id: string,
    amount: number,
    typeTransaction: TypeTransaction
    ): Promise<MonthlyRegister> {
    try {
      const monthlyRegister: MonthlyRegister = await this.findOne(id);

      if(typeTransaction === 'income') monthlyRegister.total_incomes += amount;

      if(typeTransaction === 'expense') monthlyRegister.total_expenses += amount;

      return await this.monthlyRegisterRepository.save(monthlyRegister);
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findAllByUser(userId: string)
  : Promise<{ month_code: string; total_incomes: number; total_expenses: number }[]
  > {
    try {     
      const monthlyRegisters: MonthlyRegister[] = await this.monthlyRegisterRepository.find({
        where: {
          user: {id: userId}
        }
        })      
        if(!monthlyRegisters) throw new NotFoundException("Monthly register not found");
        return monthlyRegisters.map(register => ({
          month_code: register.month_code,
          total_incomes: register.total_incomes,
          total_expenses: register.total_expenses
        }));

    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOne(id: string): Promise<MonthlyRegister> {
    try {
      const monthlyRegister: MonthlyRegister = await this.monthlyRegisterRepository.findOne({where: {id}});

        if (!monthlyRegister) throw new NotFoundException("Monthly register not found");
        return monthlyRegister;

    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async findOneByUserAndMonthCode(userId: string, monthCode: string): Promise<MonthlyRegister> {
    try {
      const register = await this.monthlyRegisterRepository.findOne({
        where: {
          user: { id: userId },
          month_code: monthCode,
        },
      });
      return register;

    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} monthlyRegister`;
  }
}
