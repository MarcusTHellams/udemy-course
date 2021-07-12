import { Links } from './../../common/entities/links.entity';
import { Meta } from './../../common/entities/meta.entity';
import { ObjectType, Field, PartialType } from '@nestjs/graphql';
import { Task } from './task.entity';
import { Pagination } from '../../common/entities/pagainated.entity';

@ObjectType()
export class PaginatedTask extends PartialType(Pagination) {
  @Field(() => [Task], { name: 'items' })
  items: Task[];
}
