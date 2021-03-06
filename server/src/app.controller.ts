import { User } from './user/entities/user.entity';
import { RepoService } from './repo/repo.service';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import faker = require('faker');
import { v4 as uuidv4 } from 'uuid';
import bcrypt = require('bcrypt');
import bcrypt2 = require('bcryptjs');
import groupBy = require('lodash.groupby');
import keyBy = require('lodash.keyby');

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly repo: RepoService,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const searchTerm = '%hotmail%';
    const qb = this.repo.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'roles')
      .where(`user.email LIKE :email`, { email: searchTerm })
      .orWhere(`user.username LIKE :username`, { username: searchTerm })
      .orWhere(`roles.name LIKE :roleName`, { roleName: searchTerm });

    const users = await qb.getMany();
    console.log(qb.getQuery(), qb.getParameters());

    const count = await this.repo.userRepo.query(
      `Select count(*) from (SELECT user.* from  user LEFT JOIN user_role on user.id = user_role.userId LEFT  JOIN role on  user_role.roleId = role.id  WHERE lower(role.name) like '%hotmail%'  or  lower(user.email)  like '%hotmail%'  or  lower(username) like '%hotmail%'  GROUP by user.id)`,
    );

    // for (let i = 0; i < 100; i++) {
    //   const title = faker.lorem.words(
    //     faker.datatype.number({ min: 3, max: 10 }),
    //   );
    //   const description = faker.lorem.sentence(
    //     faker.datatype.number({ min: 4, max: 10 }),
    //   );
    //   const id = uuidv4();
    //   const task = this.repo.taskRepo.create({
    //     title,
    //     description,
    //     id,
    //     user,
    //   });

    //   await this.repo.taskRepo.save(task);
    // }

    // const result = await bcrypt2.compare(
    //   'password',
    //   '$2a$12$2w0nYG17TQxIIfi6PTLrUuE0GCWtDssqDT/c8L6SE1BqZxnUMsm06',
    // );
    // console.log('result: ', result);

    // const userRoles = await this.repo.userRoleRepo
    //   .createQueryBuilder('userRole')
    //   .innerJoinAndSelect('userRole.role', 'roles')
    //   .where('userRole.userId = :userId', { userId: user.id })
    //   .getMany();

    // user.roles = userRoles.map((ur) => ur.role);

    return {
      users,
      count,
    };
    // const roleId = '07203ac4-93fd-46cf-8cb9-0b09e643b246';

    // for (let index = 0; index < 8; index++) {
    //   const username = faker.internet.userName();
    //   const email = faker.internet.email();
    //   const id = uuidv4();
    //   const password = await bcrypt.hash('password', 12);

    //   const user = this.repo.userRepo.create({
    //     username,
    //     email,
    //     id,
    //     password,
    //   });

    //   await this.repo.userRepo.save(user);

    //   const userRole = this.repo.userRoleRepo.create({
    //     userId: user.id,
    //     roleId,
    //   });

    //   await this.repo.userRoleRepo.save(userRole);
    // }

    return this.appService.getHello();
  }
}
