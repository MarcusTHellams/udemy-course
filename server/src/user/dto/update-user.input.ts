import { CreateUserInput } from './create-user.input';
import { UpdateTaskInput } from './../../task/dto/update-task.input';
import { UpdateRoleInput } from './../../role/dto/update-role.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { Role } from '../../role/entities/role.entity';
import { Task } from '../../task/entities/task.entity';
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  id: string;

  @Field(() => [UpdateTaskInput], { nullable: true })
  tasks: Task[];

  @Field(() => [UpdateRoleInput], { nullable: true })
  roles: Role[];
}
