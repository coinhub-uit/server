import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class DeviceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fcmToken!: string;
}
