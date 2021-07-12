import { FindAll } from './../types/findAll.types';
import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
@Injectable()
export class UserService {
  constructor(private readonly repo: RepoService) {}
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  async findAll(
    options: FindAll = { page: 1, limit: 10, orderBy: [] },
  ): Promise<Pagination<User>> {
    const QB = this.repo.userRepo.createQueryBuilder();
    const { orderBy } = options;

    const formattedOrderby = orderBy.reduce((acc, value) => {
      acc[`LOWER(${value.field})`] = value.direction;
      return acc;
    }, {});

    if (!!options.orderBy.length) {
      QB.orderBy(formattedOrderby);
    }

    return await paginate<User>(QB, options);
  }

  async findOne(id: string): Promise<User> {
    return await this.repo.userRepo.findOne(id);
  }

  async update(updateUserInput: UpdateUserInput) {
    await this.repo.userRepo.save(updateUserInput);

    await this.repo.userRoleRepo.delete({ userId: updateUserInput.id });

    if (updateUserInput?.roles?.length) {
      await this.repo.userRoleRepo.save(
        updateUserInput.roles.map((role) => {
          return {
            roleId: role.id,
            userId: updateUserInput.id,
          };
        }),
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
