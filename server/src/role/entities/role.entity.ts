import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Id field' })
  id: string;

  @Column('varchar', { name: 'name', length: 45, nullable: false })
  @Field(() => String, { description: 'Name field', name: 'name' })
  name: string;

  @Column('text', { name: 'description' })
  @Field(() => String, {
    description: 'Description field',
    name: 'description',
  })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
