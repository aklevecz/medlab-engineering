import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length } from "class-validator";

@Entity()
export class FormResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 100)
  email: string;

  @Column()
  name: string;

  @Column()
  why: string;

  @Column()
  category: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
