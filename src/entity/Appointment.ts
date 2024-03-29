import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { PreAppointment } from "./PreAppointment";
import { User } from "./User";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ default: false })
  isCanceled: boolean;

  @Column()
  date: Date;

  @ManyToOne(
    (type) => PreAppointment,
    (preAppointment) => preAppointment.appointments,
    { onDelete: "CASCADE" }
  )
  preAppointment: PreAppointment;

  @ManyToOne((type) => User, (user) => user.id)
  client: User;

  @ManyToOne((type) => User, (user) => user.id)
  partner: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
