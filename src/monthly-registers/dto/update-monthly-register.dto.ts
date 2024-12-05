import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMonthlyRegisterDto{
    @IsOptional()
    @IsNumber()
    total_incomes?: number;

    @IsOptional()
    @IsNumber()
    total_expenses?: number;

    constructor(
        total_incomes?: number,
        total_expenses?: number,
    ){
        this.total_incomes = total_incomes;
        this.total_expenses = total_expenses;
    }
}
