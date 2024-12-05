import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TypeTransaction {
    income = 'income',
    expense = 'expense'
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    user_id: string;

    @Column({ type: 'varchar', nullable: false })
    category_id: string;

    @Column({
        type: 'enum',
        enum: TypeTransaction,
    })
    type: TypeTransaction;

    @Column({
        type: 'int',
        nullable: false,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseInt(value) 
            }
    }) 
    amount: number;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @Column({ type: 'varchar', nullable: false })
    month_code: string;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;

    //relations
    @ManyToOne(() => User, (user) => user.transactions)
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(() => Category, (category) => category.transactions)
    @JoinColumn({name: 'category_id'})
    category: Category;
}
