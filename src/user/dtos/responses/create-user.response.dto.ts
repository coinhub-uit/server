import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema()
export class CreateUserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  avatar!: string;

  @ApiProperty()
  fullname!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  birthDate!: Date;

  @ApiProperty()
  citizenId!: string;
}
