import { RepoModule } from './../repo/repo.module';
import { Module } from '@nestjs/common';
import { DataSeedingService } from './data-seeding.service';

@Module({
  imports: [RepoModule],
  providers: [DataSeedingService],
})
export class DataSeedingModule {}
