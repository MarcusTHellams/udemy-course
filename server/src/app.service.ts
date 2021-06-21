import { RepoService } from './repo/repo.service';
import { Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
@Injectable()
export class AppService {
  constructor(private readonly repo: RepoService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
