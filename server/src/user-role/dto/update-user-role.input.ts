import { CreateUserRoleInput } from './create-user-role.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserRoleInput extends PartialType(CreateUserRoleInput) {
  @Field(() => Int)
  id: number;
}
