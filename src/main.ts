import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { configSwagger } from 'src/common/swagger/config';
import { GlobalFilter } from 'src/common/filters/global.filter';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GlobalFilter());
  app.use(
    session({
      secret: process.env.ADMIN_JWT_SECRET, // huhmm
      cookie: {
        maxAge: 60 * 15, // 15 mins
      },
    }),
  );
  configSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
