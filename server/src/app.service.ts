import { RepoService } from './repo/repo.service';
import { Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
@Injectable()
export class AppService {
  constructor(private readonly repo: RepoService) {}
  async getHello(): Promise<User> {
    const user = await this.repo.userRepo.findOne(
      '653453b7-ec29-47ee-8ba8-70616c37a2e8',
    );

    return user;
  }
}
