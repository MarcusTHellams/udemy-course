import { PaginatedUser } from './entities/paginatedUsers.entity';
import { PageQueryInput } from './../common/entities/pageQuery.input';
import { JwtStrategy } from './../auth/jwt.strategy';
import { roleLoader } from './../db/loaders/role.loader';
import { In } from 'typeorm';
import { Role } from './../role/entities/role.entity';
import { IGraphqlContext } from './../types/graphql.types';
import { RepoService } from './../repo/repo.service';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Task } from '../task/entities/task.entity';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly repo: RepoService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => PaginatedUser, { name: 'users' })
  findAll(
    @Args('pageQueryInput', { nullable: true }) pageQueryInput: PageQueryInput,
  ) {
    return this.userService.findAll(pageQueryInput);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(new JWTAuthGuard())
  @Query(() => String, { name: 'profile' })
  profile() {
    return 'Ok';
  }

  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() ctx: IGraphqlContext,
  ) {
    return await this.userService.update(updateUserInput, ctx.req);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => String }) id: string) {
    this.userService.remove(id);
    return true;
  }

  @ResolveField(() => [Task], { name: 'tasks', nullable: true })
  async tasks(
    @Parent() user: User,
    @Context() { taskLoader }: IGraphqlContext,
  ) {
    return await taskLoader.load(user.id);
  }

  @ResolveField(() => [Role], { name: 'roles', nullable: true })
  async roles(
    @Parent() user: User,
    @Context() { roleLoader }: IGraphqlContext,
  ) {
    const roles = await roleLoader.load(user.id);
    // const userRoles = await this.repo.userRoleRepo.find({
    //   join: {
    //     alias: 'userRole',
    //     innerJoinAndSelect: {
    //       role: 'userRole.role',
    //     },
    //   },
    //   where: {
    //     userId: user.id,
    //   },
    // });

    return roles;
  }
}
