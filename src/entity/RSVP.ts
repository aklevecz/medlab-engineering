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
@Unique("UQ_RSVP", ["email", "event"])
export class RSVP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 100)
  email: string;

  @Column({ nullable: true })
  qrId: string;

  @Column({ nullable: true })
  event: string;

  @Column({ default: false })
  boop: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
