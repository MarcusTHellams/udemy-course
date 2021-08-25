import { GqlExecutionContext } from '@nestjs/graphql';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { getUser } from '../helpers/get.user';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (ctx.req.cookies.todoio) {
      ctx.user = getUser(ctx.req.cookies.todoio);
    }
    return true;
  }
}
