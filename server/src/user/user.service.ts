import { getUser } from './../helpers/get.user';
import { IRequest } from './../types/requestWithCookie.type';
import { FindAll } from './../types/findAll.types';
import { RepoService } from './../repo/repo.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import {
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import * as yup from 'yup';
import PasswordValidator = require('password-validator');
import { v4 as uuidv4 } from 'uuid';
import bcrypt2 = require('bcryptjs');
import { diff } from 'deep-diff';

@Injectable()
export class UserService {
  constructor(private readonly repo: RepoService) {}

  async create(createUserInput: CreateUserInput) {
    const id = uuidv4();
    const password = await bcrypt2.hash(createUserInput.password, 12);
    const user = this.repo.userRepo.create({
      ...createUserInput,
      id,
      password,
    });
    await this.repo.userRepo.save(user);
    return user;
  }

  async findAll(
    options: FindAll = { page: 1, limit: 10, orderBy: [], search: '' },
  ): Promise<Pagination<User>> {
    const QB = this.repo.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'roles')
      .groupBy('user.id');

    const { orderBy = [] } = options;

    const formattedOrderby = orderBy.reduce((acc, value) => {
      acc[`lower(${value.field})`] = value.direction;
      return acc;
    }, {});

    if (!!orderBy.length) {
      QB.orderBy(formattedOrderby);
    }

    if (!!options.search) {
      QB.where('lower(user.username) like :usernameSearch', {
        usernameSearch: `%${options.search}%`,
      })
        .orWhere('lower(user.email) like :emailSearch', {
          emailSearch: `%${options.search}%`,
        })
        .orWhere('lower(roles.name) like :roleSearch', {
          roleSearch: `%${options.search}%`,
        });
    }

    // const users = await QB.limit(+options.limit)
    //   .groupBy('user.id')
    //   .offset((+options.page - 1) * +options.limit)
    //   .getMany();
    // const count = await this.repo.userRepo.query(
    //   `Select count(*) as 'count' from (SELECT user.* from  user LEFT JOIN user_role on user.id = user_role.userId LEFT  JOIN role on  user_role.roleId = role.id  WHERE lower(role.name) like '%${
    //     options.search || ''
    //   }%'  or  lower(user.email)  like '%${
    //     options.search || ''
    //   }%'  or  lower(username) like '%${
    //     options.search || ''
    //   }%'  GROUP by user.id)`,
    // );

    // const currentPage = +options.page;
    // const itemCount = users.length;
    // const itemsPerPage = +options.limit;
    // const totalItems = count[0].count;
    // const totalPages = Math.ceil(count[0].count / +options.limit);

    // console.log('count: ', count);
    // console.log('users: ', users.length);
    // console.log('pages: ', totalPages);

    // return {
    //   items: users,
    //   links: null,
    //   meta: {
    //     currentPage,
    //     itemCount,
    //     itemsPerPage,
    //     totalItems,
    //     totalPages,
    //   },
    // };

    return await paginate<User>(QB, {
      ...options,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.repo.userRepo.findOne(id);
  }

  async update(updateUserInput: UpdateUserInput, req: IRequest) {
    const reqUser = await getUser(req);

    const user = await this.repo.userRepo.findOne(updateUserInput.id, {
      relations: ['roles'],
    });

    if (reqUser && user) {
      const isDiff = diff(user?.roles, updateUserInput?.roles || []);
      if (!reqUser?.roles.includes('admin') && isDiff) {
        return new HttpException(
          'You are not authorized to update roles',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      return new HttpException(
        'You are not authorized to make this action',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.repo.userRepo.save(updateUserInput);
  }

  async remove(id: string) {
    return await this.repo.userRepo.delete(id);
  }
}
