import { RepoModule } from './../repo/repo.module';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), RepoModule],
  providers: [RoleResolver, RoleService],
})
export class RoleModule {}
