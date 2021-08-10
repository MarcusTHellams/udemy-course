import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Id field' })
  id: string;

  @Column('varchar', { name: 'title', length: 100, nullable: false })
  @Field(() => String, { description: 'Title field', name: 'title' })
  title: string;

  @Column('text', { name: 'description', nullable: true })
  @Field(() => String, {
    description: 'Description field',
    name: 'description',
    nullable: true,
  })
  description: string;

  @Field(() => String, { name: 'userId', nullable: true })
  @Column('uuid', { name: 'userId', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;
}
