import { PaginatedTask } from './entities/paginatedTasks.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { IGraphqlContext } from './../types/graphql.types';
import { RepoService } from './../repo/repo.service';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Context,
  Info,
} from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { User } from 'src/user/entities/user.entity';
import { Roles } from 'src/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { PageQueryInput } from 'src/common/entities/pageQuery.input';
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

  @Query(() => PaginatedTask, { name: 'tasks' })
  async findAll(
    @Args('pageQueryInput', { nullable: true }) pageQueryInput: PageQueryInput,
  ) {
    return await this.taskService.findAll(pageQueryInput);
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => String }) id: string) {
    console.log('id: ', id);
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
    if (task.userId) {
      const user = await userLoader.load(task.userId);
      return user;
    }

    return null;
  }
}
