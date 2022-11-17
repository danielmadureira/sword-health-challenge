import { RolesEnum } from 'src/common/enums/roles.enum';
import { Task } from 'src/task/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
  })
  role: RolesEnum;

  @OneToMany(() => Task, (task) => task.creator)
  tasks: Task[];
}
