import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema()
export class RegisterDeviceRequestDto {
  @ApiProperty({
    description: 'FCM token retrieve from FCM in client',
  })
  @IsNotEmpty()
  @IsString()
  fcmToken!: string;

  @ApiProperty({
    description: 'Device ID (taken from else where like "device info")',
  })
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
