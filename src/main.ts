import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configSwagger } from 'src/common/swagger/config';
import { GlobalFilter } from 'src/common/filters/global.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GlobalFilter());
  configSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
