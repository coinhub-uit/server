import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { GlobalFilter } from 'src/common/filters/global.filter';
import { configAppSwagger } from 'src/common/app-config/swagger.app-config';
import { configAppSession } from 'src/common/app-config/session.app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GlobalFilter());
  configAppSwagger(app);
  await configAppSession(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
