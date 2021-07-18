import { FindAll } from './../types/findAll.types';
import { Task } from './entities/task.entity';
import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { v4 as uuidv4 } from 'uuid';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

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

  async findAll(
    options: FindAll = { page: 1, limit: 1, orderBy: [] },
  ): Promise<Pagination<Task>> {
    const QB = this.repo.taskRepo.createQueryBuilder();
    const { orderBy = [] } = options;

    const formattedOrderby = orderBy.reduce((acc, value) => {
      if (value.field !== 'user') {
        acc[`LOWER(${value.field})`] = value.direction;
      }
      return acc;
    }, {});

    if (!!orderBy.length) {
      QB.orderBy(formattedOrderby);
    }

    return await paginate<Task>(QB, options);
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
