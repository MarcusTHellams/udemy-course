import { UserGuard } from './guards/user.guard';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const { PORT = 5001 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalGuards(new UserGuard());
  // app.enableCors({ origin: 'http://localhost:3001', credentials: true });
  await app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} 💯`);
  });
}
bootstrap();
