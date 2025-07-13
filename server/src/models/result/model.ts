import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from "typeorm";
import { User } from "../user/model";

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  score!: number;

  @Column()
  totalQuestions!: number;

  @Column()
  correctAnswers!: number;

  @Column({ type: 'jsonb', nullable: true })
  answers!: Record<string, any>;

  @Index()
  @CreateDateColumn()
  createdAt!: Date;

  @Index()
  @ManyToOne(() => User, (user: User) => user.results)
  user!: User;
}
