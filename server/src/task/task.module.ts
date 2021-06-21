import { RepoModule } from './../repo/repo.module';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), RepoModule],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
