import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";


export class CreateMonthlyRegisterDto {
    @IsNotEmpty()
    @IsUUID()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    month_code: string;

    @IsNotEmpty()
    @IsNumber()
    total_incomes: number;

    @IsNotEmpty()
    @IsNumber()
    total_expenses: number;

    constructor(
        user_id: string,
        month_code: string,
        total_incomes: number,
        total_expenses: number,
    ){
        this.user_id = user_id;
        this.month_code = month_code;
        this.total_incomes = total_incomes;
        this.total_expenses = total_expenses;
    }
}
