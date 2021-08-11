import { FindAll } from './../types/findAll.types';
import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import {
  paginate,
  Pagination,
  PaginationTypeEnum,
  IPaginationMeta,
} from 'nestjs-typeorm-paginate';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly repo: RepoService) {}
  create(createRoleInput: CreateRoleInput) {
    return 'This action adds a new role';
  }

  async findAll(
    options: FindAll = { page: 1, limit: 10, orderBy: [], search: null },
  ): Promise<Pagination<Role>> {
    const QB = this.repo.roleRepo.createQueryBuilder('role');

    const { orderBy = [] } = options;

    const formattedOrderby = orderBy.reduce((acc, value) => {
      acc[`lower(${value.field})`] = value.direction;
      return acc;
    }, {});

    if (!!options.search) {
      QB.where(`lower(role.name) LIKE '%${options.search}%'`);
    }

    if (!!orderBy.length) {
      QB.orderBy(formattedOrderby);
    }

    return await paginate<Role>(QB, {
      ...options,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: string, updateRoleInput: UpdateRoleInput) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
