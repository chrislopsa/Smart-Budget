import { IsString, IsNumber, IsNotEmpty, IsEnum, Min} from "class-validator";
import { TypeTransaction } from "../entities/transaction.entity";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    category_id: string;
    
    @IsEnum(TypeTransaction)
    @IsNotEmpty()
    type: TypeTransaction;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount: number;
}

