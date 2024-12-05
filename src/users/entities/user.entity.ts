import { Category } from 'src/categories/entities/category.entity';
import { MonthlyRegister } from 'src/monthly-registers/entities/monthly-register.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn 
} from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    username: string;

    @Column({ type: 'varchar', nullable: false, unique: true})
    email: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: false })
    phone: string;
    
    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;

    //relations
    @OneToMany(() => Category, (category) => category.user )
    categories: Category[];

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];

    @OneToMany(() => MonthlyRegister, (monthlyRegister) => monthlyRegister.user_id)
    monthlyRegisters: MonthlyRegister[];
}
