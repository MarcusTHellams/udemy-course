import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { RepoModule } from './repo/repo.module';
import { TaskModule } from './task/task.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: `${join(__dirname, '../../', 'udemy-course.db')}`,
      synchronize: true,
      type: 'sqlite',
    }),
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UserModule,
    RepoModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
