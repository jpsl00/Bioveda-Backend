import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Appointment } from "./Appointment";
import { User } from "./User";

@Entity()
export class PreAppointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  isCanceled: boolean;

  @ManyToOne((type) => User, (user) => user.id)
  client: User;

  @ManyToOne((type) => User, (user) => user.id)
  employee: User;

  @ManyToOne((type) => User, (user) => user.id)
  partner: User;

  @OneToMany((type) => Appointment, (appointment) => appointment.preAppointment)
  appointments: Appointment[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
