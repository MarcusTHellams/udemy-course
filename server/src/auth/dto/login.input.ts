import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Username field' })
  username: string;

  @Field(() => String, { description: 'Password field' })
  password: string;
}
