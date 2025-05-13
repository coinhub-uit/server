import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { AbstractResponseDto } from 'src/common/dto/abstract.response.dto';

@ApiSchema()
export class NotificationResponseDto extends AbstractResponseDto<NotificationResponseDto> {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  isRead!: boolean;
}
