import { permissions } from './authorization/rules';
import { userLoader } from './db/loaders/user.loader';
import { roleLoader } from './db/loaders/role.loader';
import { taskLoader } from './db/loaders/task.loader';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { RepoModule } from './repo/repo.module';
import { TaskModule } from './task/task.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { buildContext } from 'graphql-passport';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { PrismaService } from './prisma/prisma.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: `${join(__dirname, '../../', 'udemy-course.db')}`,
      synchronize: true,
      type: 'sqlite',
      logging: 'all',
      logger: 'advanced-console',
    }),
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      transformSchema: (schema: GraphQLSchema) => {
        schema = applyMiddleware(schema, permissions);
        return schema;
      },
      cors: {
        origin: 'http://localhost:3001',
        credentials: true,
      },
      context: ({ req, res }) =>
        buildContext({
          req,
          res,
          taskLoader: taskLoader(),
          roleLoader: roleLoader(),
          userLoader: userLoader(),
        }),
    }),
    UserModule,
    RepoModule,
    TaskModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
