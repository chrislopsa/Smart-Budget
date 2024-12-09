import { User } from "src/users/entities/user.entity";
import { 
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";


@Entity('monthly_registers')
export class MonthlyRegister {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    user_id: string;

    @Column({ type: 'varchar', nullable: false })
    month_code: string;

    @Column({
        type: 'int',
        default: 0,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseInt(value) 
            }
    }) 
    total_incomes: number;

    @Column({
        type: 'int',
        default: 0,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseInt(value) 
            }
    }) 
    total_expenses: number;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;

    @ManyToOne(()=> User, (user) => user.monthlyRegisters)
    @JoinColumn({name: 'user_id'})
    user: User;
}
