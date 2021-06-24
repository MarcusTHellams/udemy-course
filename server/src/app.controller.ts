import { RepoService } from './repo/repo.service';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import faker = require('faker');
import { v4 as uuidv4 } from 'uuid';
import bcrypt = require('bcrypt');

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly repo: RepoService,
  ) {}

  @Get()
  async getHello(): Promise<any> {
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
