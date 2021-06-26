import { RepoModule } from './../repo/repo.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [RepoModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
