import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../models/user/model";

@Entity()
export class Result {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    score!: number;

    @Column()
    totalQuestions!: number;

    @Column()
    correctAnswers!: number;

    @Column({ type: 'jsonb', nullable: true })
    answers!: Record<string, any>;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user: User) => user.results)
    user!: User;
} 