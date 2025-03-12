import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { writeFileSync } from 'fs';

export function configSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('CoinHub')
    .setDescription('CoinHub API endpoint')
    .addBearerAuth()
    .build();
  const documentFactory = () => {
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    const outputPath = path.join(
      process.cwd(),
      'web',
      'swagger',
      'swagger.json',
    );
    writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });
    return document;
  };
  SwaggerModule.setup('api', app, documentFactory);
}
