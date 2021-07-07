import { Links } from './../../common/entities/links.entity';
import { Meta } from './../../common/entities/meta.entity';
import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from './task.entity';

@ObjectType()
export class PaginatedTask {
  @Field(() => [Task], { name: 'items' })
  items: Task[];

  @Field(() => Meta, { name: 'meta' })
  meta: Meta;

  @Field(() => Links, { name: 'links', nullable: true })
  links: Links;
}
