import { AppModule } from './../app.module';
import { NestFactory } from '@nestjs/core';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('app: ', app);
  console.log('Hello');
})();
