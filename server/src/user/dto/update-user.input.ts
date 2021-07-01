import { UpdateTaskInput } from './../../task/dto/update-task.input';
import { UpdateRoleInput } from './../../role/dto/update-role.input';
import { InputType, Field } from '@nestjs/graphql';
import { Role } from 'src/role/entities/role.entity';
import { Task } from 'src/task/entities/task.entity';
@InputType()
export class UpdateUserInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  imageUrl: string;

  @Field(() => [UpdateTaskInput], { nullable: true })
  tasks: Task[];

  @Field(() => [UpdateRoleInput], { nullable: true })
  roles: Role[];
}
