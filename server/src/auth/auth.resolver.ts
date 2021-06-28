import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { add } from 'date-fns';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() ctx: any,
  ) {
    const { user } = await ctx.authenticate('graphql-local', {
      username,
      password,
    });
    const { access_token } = await this.authService.login(user);
    ctx.res.cookie('todoio', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: add(new Date(), { minutes: 30 }),
      path: '/',
    });
    return JSON.stringify(user);
  }

  @Mutation(() => String)
  async logout(@Context() ctx: any) {
    ctx.res.clearCookie('todoio');
    return 'Logged Out Successfully';
  }
}
