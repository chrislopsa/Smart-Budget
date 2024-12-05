import { Module } from '@nestjs/common';
import { MonthlyRegistersService } from './monthly-registers.service';
import { MonthlyRegistersController } from './monthly-registers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyRegister } from './entities/monthly-register.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([MonthlyRegister])
  ],
  controllers: [MonthlyRegistersController],
  providers: [MonthlyRegistersService],
  exports: [MonthlyRegistersService]
})
export class MonthlyRegistersModule {}
