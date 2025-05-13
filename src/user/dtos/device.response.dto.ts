import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { AbstractResponseDto } from 'src/common/dto/abstract.response.dto';

@ApiSchema()
export class DeviceResponseDto extends AbstractResponseDto<DeviceResponseDto> {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fcmToken!: string;
}
