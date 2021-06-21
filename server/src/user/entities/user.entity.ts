import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Id field' })
  id: string;

  @Column('varchar', { name: 'username', length: 45, nullable: false })
  @Field(() => String, { description: 'Username field', name: 'username' })
  username: string;

  @Column('varchar', { name: 'password', nullable: false })
  @Field(() => String, { description: 'Password field', name: 'password' })
  password: string;

  @Column('varchar', { name: 'email', nullable: false })
  @Field(() => String, { description: 'Email field', name: 'email' })
  email: string;
}
