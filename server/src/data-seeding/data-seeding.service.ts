import { RepoService } from './../repo/repo.service';
import { Injectable } from '@nestjs/common';
import faker = require('faker');
import bcrypt = require('bcryptjs');
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class DataSeedingService {
  constructor(private readonly repo: RepoService) {}
  async seedUsers() {
    const users: Partial<User>[] = [];
    for (let index = 0; index < 89; index++) {
      const password = await bcrypt.hash('password', 12);

      const user: Partial<User> = {
        id: uuidv4(),
        username: faker.internet.userName(),
        password,
        email: faker.internet.email(),
        imageUrl: faker.internet.avatar(),
      };

      users.push(user);
    }

    try {
      const result = this.repo.userRepo.create(users);
      await this.repo.userRepo.save(result);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  async fillInMissingImageUrls() {
    const users = await this.repo.userRepo.find({
      where: { imageUrl: IsNull() },
    });
    users.forEach((user) => (user.imageUrl = faker.internet.avatar()));
    await this.repo.userRepo.save(users);
  }
}
