import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { CategoriesModule } from './categories/categories.module';
import { MonthlyRegistersModule } from './monthly-registers/monthly-registers.module';
import { Category } from './categories/entities/category.entity';
import { MonthlyRegister } from './monthly-registers/entities/monthly-register.entity';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST, 
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER , 
      password: process.env.DB_PASS , 
      database: process.env.DB_NAME , 
      entities: [__dirname + '/**/*.entity{.ts,.js}', User, Transaction, Category, MonthlyRegister],  
      synchronize: true,
    }),
     UsersModule,
     TransactionsModule,
     CategoriesModule,
     MonthlyRegistersModule,
     AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
