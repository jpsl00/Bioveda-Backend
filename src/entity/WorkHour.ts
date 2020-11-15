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

  @Column()
  start: number;

  @Column()
  end: number;

  @Column({ type: "simple-json" })
  days: EWorkDays[];

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
