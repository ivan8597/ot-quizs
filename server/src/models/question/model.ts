import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

interface Option {
    id: number;
    text: string;
}

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @Column('jsonb')
    options!: Option[];

    @Column()
    correctOptionId!: number;

    @Column({ nullable: true })
    ntd?: string;
}