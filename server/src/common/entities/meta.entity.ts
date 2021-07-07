import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Meta {
  @Field(() => Int, { name: 'itemCount' })
  itemCount: number;

  @Field(() => Int, { name: 'totalItems' })
  totalItems: number;

  @Field(() => Int, { name: 'itemsPerPage' })
  itemsPerPage: number;

  @Field(() => Int, { name: 'totalPages' })
  totalPages: number;

  @Field(() => Int, { name: 'currentPage' })
  currentPage: number;
}
