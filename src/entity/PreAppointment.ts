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

  // Personal
  @Column()
  personalWeight: string;

  @Column()
  personalHeight: string;

  @Column()
  personalAge: string;

  // Medical
  @Column({ nullable: true })
  medicalPulse: string;

  @Column({ nullable: true })
  medicalLanguage: string;

  @Column({ nullable: true, type: "simple-array" })
  medicalDosha: string;

  @Column({ nullable: true, type: "simple-array" })
  medicalRecommendations: string[];

  // Complaint
  @Column()
  complaintType: string;

  @Column()
  complaint: string;

  // FKs
  @ManyToOne((type) => User, (user) => user.id)
  client: User;

  @OneToMany(
    (type) => Appointment,
    (appointment) => appointment.preAppointment
    //{ onDelete: "CASCADE" }
  )
  appointments: Appointment[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
