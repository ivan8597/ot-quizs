import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Result } from "./Result";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    name!: string;

    @OneToMany(() => Result, result => result.user)
    results!: Result[];
} 