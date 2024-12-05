import {Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Entity, ManyToOne, JoinColumn, OneToMany} from 'typeorm'
import { Transaction, TypeTransaction } from 'src/transactions/entities/transaction.entity'
import { User } from 'src/users/entities/user.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    user_id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({
        type: 'enum',
        enum: TypeTransaction,
        nullable: false
    })
    type: TypeTransaction;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deleted_at: Date;

    //relations
    @ManyToOne(()=> User, (user)=> user.categories)
    @JoinColumn({name: 'user_id'})
    user: User

    @OneToMany(() => Transaction, (transaction) => transaction.category)
    transactions: Transaction[];
}
