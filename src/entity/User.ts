import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { PreAppointment } from "./PreAppointment";

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

  @Column()
  name: string;

  @Column()
  @IsNotEmpty()
  role: EPermissionLevel;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
