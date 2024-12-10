import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { TypeTransaction } from "src/transactions/entities/transaction.entity";

export class CreateCategoryDto {  
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEnum(TypeTransaction)
    @IsNotEmpty()
    type: TypeTransaction;
}
