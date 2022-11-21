import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { RolesEnum } from '../common/enums/roles.enum';
import { Task } from '../task/task.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
  })
  role: RolesEnum;

  @OneToMany(() => Task, (task) => task.creator)
  tasks: Task[];
}
