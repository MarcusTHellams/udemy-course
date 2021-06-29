import { IGraphqlContext } from './../types/graphql.types';
import { RepoService } from './../repo/repo.service';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly repo: RepoService,
  ) {}

  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    return this.taskService.create(createTaskInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll(@Context() ctx) {
    // console.log('ctx.req.cookie: ', ctx.req.cookies);
    // ctx.res.cookie('name', 'marcus', {
    //   httpOnly: true,
    // });
    return this.taskService.findAll();
  }

  @Query(() => Task, { name: 'task' })
  @Roles('admin')
  @UseGuards(RolesGuard)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.taskService.findOne(id);
  }

  @Mutation(() => Task)
  async updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    await this.taskService.update(updateTaskInput.id, updateTaskInput);
    return await this.findOne(updateTaskInput.id);
  }

  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => String }) id: string) {
    this.taskService.remove(id);
    return true;
  }

  @ResolveField(() => User, { name: 'user', nullable: true })
  async user(@Parent() task: Task, @Context() { userLoader }: IGraphqlContext) {
    const user = await userLoader.load(task.userId);
    return user;
  }
}
