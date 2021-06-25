import { userLoader } from './../db/loaders/user.loader';
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
  findAll() {
    return this.taskService.findAll();
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.taskService.findOne(id);
  }

  @Mutation(() => Task)
  async updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    this.taskService.update(updateTaskInput.id, updateTaskInput);
    return await this.findOne(updateTaskInput.id);
  }

  @Mutation(() => Task)
  removeTask(@Args('id', { type: () => Int }) id: number) {
    return this.taskService.remove(id);
  }

  @ResolveField(() => User, { name: 'user', nullable: true })
  async user(@Parent() task: Task, @Context() { userLoader }: IGraphqlContext) {
    const user = await userLoader.load(task.userId);
    return user;
  }
}
