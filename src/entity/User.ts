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

  @Column()
  @IsNotEmpty()
  role: EPermissionLevel;

  @Column()
  @IsNotEmpty()
  birthdate: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => WorkHour)
  workHours: WorkHour;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}

export enum EPermissionLevel {
  "Invalid" = -1,
  "User" = 0,
  "Partner" = 1,
  "Employee" = 2,
  "Admin" = 10,
}
