import { getUser } from './../helpers/get.user';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JWTAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard extends JWTAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    if (!ctx.req.cookies.todoio) {
      return false;
    }
    const user = (await getUser(ctx.req.cookies.todoio)) as { roles: string[] };

    const isAuthorized = roles.some((role) => user.roles.includes(role));

    return isAuthorized;
  }
}
