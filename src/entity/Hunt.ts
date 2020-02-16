import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Hunt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  code: string;

  @Column()
  @IsNotEmpty()
  cat: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
