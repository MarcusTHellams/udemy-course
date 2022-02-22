import { InputType, Field } from '@nestjs/graphql';
import { UpdateUserInput } from 'src/user/dto/update-user.input';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => UpdateUserInput, { nullable: true })
  user: User;
}
