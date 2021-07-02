import { Task } from './entities/task.entity';
import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TaskService {
  constructor(private readonly repo: RepoService) {}
  async create(createTaskInput: CreateTaskInput): Promise<Task> {
    const task = this.repo.taskRepo.create({
      ...createTaskInput,
      id: uuidv4(),
    });
    await this.repo.taskRepo.save(task);
    return task;
  }

  async findAll(): Promise<Task[]> {
    return await this.repo.taskRepo.find();
  }

  async findOne(id: string) {
    return this.repo.taskRepo.findOne(id);
  }

  async update(id: string, updateTaskInput: UpdateTaskInput) {
    const task = await this.repo.taskRepo.findOne(updateTaskInput.id);

    Object.keys(task).forEach((key) => {
      if (!updateTaskInput[key]) {
        task[key] = null;
      } else {
        task[key] = updateTaskInput[key];
      }
    });

    await this.repo.taskRepo.update(task.id, task);
  }

  async remove(id: string) {
    return await this.repo.taskRepo.delete(id);
  }
}
