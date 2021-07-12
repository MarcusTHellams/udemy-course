import { ObjectType, Field } from '@nestjs/graphql';
import { Links } from './links.entity';
import { Meta } from './meta.entity';

@ObjectType()
export class Pagination {
  @Field(() => Meta, { name: 'meta' })
  meta: Meta;

  @Field(() => Links, { name: 'links', nullable: true })
  links: Links;
}
