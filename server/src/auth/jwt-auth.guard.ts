import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.req.cookies.todoio) {
      return false;
    }
    ctx.user = await this.validateToken(ctx.req.cookies.todoio);
    return true;
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, 'mySecret');
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
