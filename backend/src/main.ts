import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { PORT, MONGO_DB_HOST } = process.env;

async function bootstrap() {
  console.log('MONGO_DB_HOST', MONGO_DB_HOST);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(PORT);
}
bootstrap();
