import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext, ArgsOptions } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GQLLocalAuthGuard extends AuthGuard('graphql-local') {}
