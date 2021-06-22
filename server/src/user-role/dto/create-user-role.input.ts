import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserRoleInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
