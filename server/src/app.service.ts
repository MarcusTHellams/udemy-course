import { RepoService } from './repo/repo.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  constructor(private readonly repo: RepoService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
