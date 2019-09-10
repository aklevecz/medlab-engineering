import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
@Unique("UQ_TICK", ["qrId", "cat"])
export class Toad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  gen: string;

  @Column()
  @IsNotEmpty()
  @Length(4, 20)
  qrId: string;

  @Column()
  @IsNotEmpty()
  cat: string;

  @Column()
  @IsNotEmpty()
  owner: number;

  @Column({ default: false })
  @IsNotEmpty()
  boop: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
