import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { PreAppointment } from "./PreAppointment";
import { WorkHour } from "./WorkHour";
import { Appointment } from "./Appointment";

export enum EPermissionLevel {
  "Invalid" = -1,
  "User" = 0,
  "Partner" = 1,
  "Employee" = 2,
  "Admin" = 10,
}

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 32)
  username: string;

  @Column()
  @Length(4, 64)
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ default: EPermissionLevel.User })
  @IsNotEmpty()
  role: EPermissionLevel;

  @Column({ nullable: true })
  birthdate: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  // ! Apenas para parceiros
  @Column({ nullable: true })
  specialty: string;

  @OneToOne(() => WorkHour, (workHour) => workHour.user, {
    nullable: true,
    cascade: true,
  })
  workHours: WorkHour;

  // ! Relações
  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.partner)
  partnerAppointments: Appointment[];

  // ! Funções
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
