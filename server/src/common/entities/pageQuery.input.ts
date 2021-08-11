import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(Direction, {
  name: 'Direction',
});

@InputType()
class OrderByInput {
  @Field(() => String)
  field: string;

  @Field(() => Direction)
  direction: Direction;
}

@InputType()
export class PageQueryInput {
  @Field(() => Int, { nullable: true })
  page: number;

  @Field(() => Int, { nullable: true })
  limit: number;

  @Field(() => [OrderByInput], { nullable: true })
  orderBy: OrderByInput[];

  @Field(() => String, { nullable: true })
  search: string;
}
