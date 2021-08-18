import { FindAll } from './../types/findAll.types';
import { Task } from './entities/task.entity';
import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { v4 as uuidv4 } from 'uuid';
import {
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import * as yup from 'yup';

const taskSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().nullable(),
});
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
    options: FindAll = { page: 1, limit: 1, orderBy: [], search: null },
  ): Promise<Pagination<Task>> {
    const QB = this.repo.taskRepo
      .createQueryBuilder('task')
      .leftJoin('task.user', 'user')
      .groupBy('task.id');
    const { orderBy = [] } = options;

    const formattedOrderby = orderBy.reduce((acc, value) => {
      acc[`LOWER(${value.field})`] = value.direction;
      return acc;
    }, {});

    if (!!options.search) {
      QB.where(
        `lower(task.title) || lower(task.description) || lower(user.username) || lower(user.email) LIKE '%${options.search}%'`,
      );
    }

    if (!!orderBy.length) {
      QB.orderBy(formattedOrderby);
    }

    return await paginate<Task>(QB, {
      ...options,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    });
  }

  async findOne(id: string) {
    return this.repo.taskRepo.findOne(id);
  }

  async update(id: string, updateTaskInput: UpdateTaskInput) {
    const task = await this.repo.taskRepo.findOne(updateTaskInput.id, {
      relations: ['user'],
    });

    // Object.keys(task).forEach((key) => {
    //   if (!updateTaskInput[key]) {
    //     task[key] = null;
    //   } else {
    //     task[key] = updateTaskInput[key];
    //   }
    // });

    await this.repo.taskRepo.update(task.id, updateTaskInput);
  }

  async remove(id: string) {
    return await this.repo.taskRepo.delete(id);
  }
}
