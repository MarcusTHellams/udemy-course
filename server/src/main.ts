import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { PORT = 5001 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} 💯`);
  });
}
bootstrap();
