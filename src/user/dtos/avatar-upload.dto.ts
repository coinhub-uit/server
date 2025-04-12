import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class AvatarUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
