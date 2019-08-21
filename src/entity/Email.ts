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
@Unique(["email"])
export class RSVP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 100)
  email: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
