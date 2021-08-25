import { NestFactory } from '@nestjs/core';
import { DataSeedingService } from './../data-seeding/data-seeding.service';
import { DataSeedingModule } from './../data-seeding/data-seeding.module';
import { AppModule } from './../app.module';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSeedingService = app
    .select(DataSeedingModule)
    .get(DataSeedingService, { strict: true });

  await dataSeedingService.fillInMissingImageUrls();
  app.close();
})();
