import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { GlobalFilter } from 'src/common/filters/global.filter';
import { configAppSwagger } from 'src/common/app-config/swagger.app-config';
import { configAppSession } from 'src/common/app-config/session.app-config';
import * as fs from 'fs';
import * as path from 'path';

// TODO: Async later?
function ensureUploadPathExists() {
  const resolvedPath = path.resolve(process.env.UPLOAD_PATH);
  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true });
    console.log(`Created upload directory at: ${resolvedPath}`);
  } else {
    console.warn(
      'UPLOAD_PATH environment variable is not set. Skipping upload directory creation.',
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GlobalFilter());
  configAppSwagger(app);
  await configAppSession(app);

  ensureUploadPathExists();

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
