import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  response: string;

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
