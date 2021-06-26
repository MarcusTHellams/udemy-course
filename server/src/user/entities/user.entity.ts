import { UserRole } from './../../user-role/entities/user-role.entity';
import { Role } from './../../role/entities/role.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from '../../task/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Id field' })
  id: string;

  @Column('varchar', {
    name: 'username',
    length: 45,
    nullable: false,
    unique: true,
  })
  @Field(() => String, { description: 'Username field', name: 'username' })
  username: string;

  @Column('varchar', { name: 'password', nullable: false, select: false })
  @Field(() => String, {
    description: 'Password field',
    name: 'password',
    nullable: true,
  })
  password: string;

  @Column('varchar', { name: 'email', nullable: false })
  @Field(() => String, { description: 'Email field', name: 'email' })
  email: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => UserRole, (ur) => ur.role)
  roles: Role[];
}
