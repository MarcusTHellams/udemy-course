import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.entity';
import { PartialType } from '@nestjs/graphql';
import { Pagination } from 'src/common/entities/pagainated.entity';

@ObjectType()
export class PaginatedUser extends PartialType(Pagination) {
  @Field(() => [User], { name: 'items' })
  items: User[];
}
