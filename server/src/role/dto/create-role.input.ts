import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  @Field(() => String, { description: 'Id field', name: 'id' })
  id: string;

  @Field(() => String, { description: 'Name field', name: 'name' })
  name: string;
}
