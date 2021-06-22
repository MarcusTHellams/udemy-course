import { UserRole } from './../user-role/entities/user-role.entity';
import { Role } from './../role/entities/role.entity';
import { Task } from './../task/entities/task.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RepoService {
  constructor(
    @InjectRepository(User) public readonly userRepo: Repository<User>,
    @InjectRepository(Task) public readonly taskRepo: Repository<Task>,
    @InjectRepository(Role) public readonly roleRepo: Repository<Role>,
    @InjectRepository(UserRole)
    public readonly userRoleRepo: Repository<UserRole>,
  ) {}
}
