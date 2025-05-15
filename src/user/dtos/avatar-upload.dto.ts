import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Express } from 'express';

@ApiSchema()
export class AvatarUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
