import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Links {
  @Field(() => String, { name: 'first' })
  first: string;

  @Field(() => String, { name: 'previous' })
  previous: string;

  @Field(() => String, { name: 'next' })
  next: string;

  @Field(() => String, { name: 'last' })
  last: string;
}
