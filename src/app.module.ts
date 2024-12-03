import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
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
      entities: [__dirname + '/**/*.entity{.ts,.js}', User],  
      synchronize: true,
    }),
     UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
