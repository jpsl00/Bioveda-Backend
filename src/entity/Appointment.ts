import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { PreAppointment } from "./PreAppointment";
import { User } from "./User";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  isCanceled: boolean;

  @ManyToOne(
    (type) => PreAppointment,
    (preAppointment) => preAppointment.appointments
  )
  preAppointment: PreAppointment;

  @ManyToOne((type) => User)
  client: User;

  @ManyToOne((type) => User, (user) => user.id)
  employee: User;

  @ManyToOne((type) => User, (user) => user.id)
  partner: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  completedAt: Date;
}
