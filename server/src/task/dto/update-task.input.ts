import { UpdateUserInput } from './../../user/dto/update-user.input';
import { User } from './../../user/entities/user.entity';
import { CreateTaskInput } from './create-task.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => UpdateUserInput, { nullable: true })
  user: User;
}
