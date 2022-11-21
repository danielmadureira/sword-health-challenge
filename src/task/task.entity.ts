import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  summary: Buffer;

  @Column()
  date: Date;

  @JoinColumn({ name: 'creator' })
  @ManyToOne(() => User, (user) => user.tasks)
  creator: User;
}
