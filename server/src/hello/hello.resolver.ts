import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { HelloService } from './hello.service';
import { Hello } from './entities/hello.entity';
import { CreateHelloInput } from './dto/create-hello.input';
import { UpdateHelloInput } from './dto/update-hello.input';

@Resolver(() => Hello)
export class HelloResolver {
  constructor(private readonly helloService: HelloService) {}

  @Mutation(() => Hello)
  createHello(@Args('createHelloInput') createHelloInput: CreateHelloInput) {
    return this.helloService.create(createHelloInput);
  }

  @Query(() => [Hello], { name: 'hello' })
  findAll() {
    return this.helloService.findAll();
  }

  @Query(() => Hello, { name: 'hello' })
  findOne(@Args('id', { type: () => Int }) id: number, @Context() context) {
    console.log('context: ', context);
    return this.helloService.findOne(id);
  }

  @Mutation(() => Hello)
  updateHello(@Args('updateHelloInput') updateHelloInput: UpdateHelloInput) {
    return this.helloService.update(updateHelloInput.id, updateHelloInput);
  }

  @Mutation(() => Hello)
  removeHello(@Args('id', { type: () => Int }) id: number) {
    return this.helloService.remove(id);
  }
}
