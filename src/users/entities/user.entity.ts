import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;
}
