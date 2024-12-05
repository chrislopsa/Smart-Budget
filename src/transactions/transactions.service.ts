import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
     private readonly transactionRepository: Repository<Transaction>,
     private readonly monthlyRegistersService: MonthlyRegistersService,
     private readonly categoriesService: CategoriesService,
     private readonly usersService: UsersService,
  ){}

  async create(Dto: CreateTransactionDto, monthCode: string) {
      try {
      const newTransaction = this.transactionRepository.create({
        ...Dto,
        month_code: monthCode
      })
        return await this.transactionRepository.save(newTransaction)

      } catch (error) {
        throw new HttpException(
          error.message || "Error saving transation in DB ",
          error.status || 500
        );
      }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }


  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async handleMonthlyRegisterAndTransactions(Dto: CreateTransactionDto){
    
    const userFound: User = await this.usersService.findOne(Dto.user_id);
    if(!userFound) throw new NotFoundException("El usuario no existe");

    const categoryFound: Category = await this.categoriesService.findOneByIdAndUser(
      Dto.category_id,
      Dto.user_id);
    if(!categoryFound) throw new NotFoundException("La categoría asociada al usuario no existe");

    if(categoryFound.type !== Dto.type){
      throw new BadRequestException(['tipo de categoría y tipo de transaccion deben ser las mismas']);
    } 

    const currentDate = dayjs().utc().startOf('day');
    const monthCode = currentDate.format('YYYY-MM');

    //check if a monthly register already exists:
    let monthlyRegister: MonthlyRegister | string = await this.monthlyRegistersService.findOneByUserAndMonthCode(
      Dto.user_id,
      monthCode,
    )
    
    //create a monthly register if one does not exist
    if(!monthlyRegister){
      monthlyRegister = await this.monthlyRegistersService.create(
        Dto.user_id,
        monthCode,
        Dto.amount,
        Dto.type,
      );
    }

    if(monthlyRegister){
      const newTransaction: Transaction = await this.create(Dto, monthCode)

      if(newTransaction){
        return await this.monthlyRegistersService.update(
          monthlyRegister.id,
          Dto.amount,
          Dto.type,
        )
      }
    }
  }
}
