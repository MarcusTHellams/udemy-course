import { CreateHelloInput } from './create-hello.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHelloInput extends PartialType(CreateHelloInput) {
  @Field(() => Int)
  id: number;
}
