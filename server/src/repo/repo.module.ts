import { Role } from './../role/entities/role.entity';
import { Task } from './../task/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task, Role])],
  providers: [RepoService],
  exports: [RepoService],
})
export class RepoModule {}
