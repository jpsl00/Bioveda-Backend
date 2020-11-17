import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { User } from "./User";

@Entity()
@Unique(["user"])
export class WorkHour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "simple-json" })
  days: IWorkDays[];

  @OneToOne(() => User, (user) => user.workHours)
  @JoinColumn()
  user: User;
}

export enum EWorkDays {
  sun,
  mon,
  tue,
  wed,
  thu,
  fri,
  sat,
}

export interface IWorkDays {
  day: EWorkDays;
  start: number;
  end: number;
}
