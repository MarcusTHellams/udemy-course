import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsEmail,
  Equals,
} from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Field(() => String)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @Match('password')
  @Field(() => String)
  passwordConfirmation: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  imageUrl: string;
}
