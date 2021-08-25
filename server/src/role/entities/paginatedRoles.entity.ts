import { ObjectType, Field } from '@nestjs/graphql';
import { PartialType } from '@nestjs/graphql';
import { Pagination } from '../../common/entities/pagainated.entity';
import { Role } from './role.entity';

@ObjectType()
export class PaginatedRole extends PartialType(Pagination) {
  @Field(() => [Role], { name: 'items' })
  items: Role[];
}
