import { Role } from './../../role/entities/role.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from '../../task/entities/task.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

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

  @Column('varchar', { name: 'password', nullable: false })
  password: string;

  @Column('varchar', { name: 'email', nullable: false })
  @Field(() => String, { description: 'Email field', name: 'email' })
  email: string;

  @Column('text', { name: 'imageUrl', nullable: true })
  @Field(() => String, {
    description: 'ImageUrl field',
    name: 'imageUrl',
    nullable: true,
  })
  imageUrl: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
