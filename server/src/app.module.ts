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
import { UserRoleModule } from './user-role/user-role.module';
import { AuthModule } from './auth/auth.module';
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
      cors: {
        origin: 'http://localhost:3001',
        credentials: true,
      },
      context: ({ req, res }) => ({
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
    UserRoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
