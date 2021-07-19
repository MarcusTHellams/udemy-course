import { FindAll } from './types/findAll.types';
import { PrismaService } from './prisma/prisma.service';
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
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    // return await this.repo.taskRepo.find();
    return await this.prisma.user.findMany({
      orderBy: [{}],
      include: {
        user_role: {
          select: {
            role: true,
          },
        },
      },
    });
    return await this.prisma.task.findMany({
      orderBy: [
        {
          user: {
            username: 'asc',
          },
        },
      ],
      include: {
        user: true,
      },
    });
  }
}
