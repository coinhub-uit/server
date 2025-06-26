import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { GlobalFilter } from 'src/common/filters/global.filter';
import { configAppSwagger } from 'src/common/app-config/swagger.app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: false, // nested type this cause not to run ;///?
    }),
  );
  app.useGlobalFilters(new GlobalFilter());
  configAppSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
