import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";
import { Result } from "../result/model";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Index()
  @Column({ unique: true })
  email?: string;

  @Column()
  password?: string;

  @Index()
  @Column()
  name!: string;

  @OneToMany(() => Result, (result) => result.user)
  results?: Result[];
}