import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Estimate app')
    .setDescription('api for estimate app')
    .setVersion('1.0')
    .addTag('estimate')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory);
  await app.listen(PORT);
}
bootstrap();
