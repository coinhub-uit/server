import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class NotificationResponseDto {
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
