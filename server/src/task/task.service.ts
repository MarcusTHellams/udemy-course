import { Task } from './entities/task.entity';
import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Injectable()
export class TaskService {
  constructor(private readonly repo: RepoService) {}
  create(createTaskInput: CreateTaskInput) {
    return 'This action adds a new task';
  }

  async findAll(): Promise<Task[]> {
    return await this.repo.taskRepo.find();
  }

  async findOne(id: string) {
    return this.repo.taskRepo.findOne(id);
  }

  async update(id: string, updateTaskInput: UpdateTaskInput) {
    return await this.repo.taskRepo.save(updateTaskInput);
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
