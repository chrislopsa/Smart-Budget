import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) { 
    @IsNumber()
    @Min(1)
    amount?: number;

    @IsString()
    description?: string;
}
