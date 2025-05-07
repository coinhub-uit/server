import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as path from 'path';
import { writeFileSync } from 'fs';

export function configAppSwagger(app: INestApplication<any>) {
  // TODO: This seem isn't right? it's the site, not the api docs site?
  const config = new DocumentBuilder()
    .setTitle('CoinHub')
    .setDescription('CoinHub API docs')
    .addBearerAuth(
      { type: 'http', bearerFormat: 'JWT', scheme: 'bearer' },
      'user',
    )
    .addBearerAuth(
      { type: 'http', bearerFormat: 'JWT', scheme: 'bearer' },
      'admin',
    )
    .build();
  const options: SwaggerCustomOptions = {
    customSiteTitle: 'CoinHub API docs',
  };
  const documentFactory = () => {
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    const outputPath = path.join(
      process.cwd(),
      'web',
      'swagger',
      'swagger.json',
    );
    if (process.env.NODE_ENV !== 'production') {
      writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });
    }
    return document;
  };
  SwaggerModule.setup('api', app, documentFactory, options);
}
