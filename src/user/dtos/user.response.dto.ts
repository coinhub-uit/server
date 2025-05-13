import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { URL_PATTERN } from 'lib/regex';
import { AbstractResponseDto } from 'src/common/dto/abstract.response.dto';

@ApiSchema({ name: UserResponseDto.name })
export class UserResponseDto extends AbstractResponseDto<UserResponseDto> {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ nullable: true, type: Date, example: null })
  deletedAt!: Date | null;

  @ApiProperty()
  fullname!: string;

  @ApiProperty()
  birthDate!: Date;

  @ApiProperty()
  citizenId!: string;

  @ApiProperty({ type: String, nullable: true, description: 'Avatar URL' })
  @Transform(
    ({
      value,
      obj,
    }: {
      value: UserResponseDto['avatar'];
      obj: UserResponseDto;
    }) =>
      value && URL_PATTERN.test(value)
        ? value
        : `${process.env.API_SERVER_URL}/users/${obj.id}/avatar`,
  )
  avatar!: string | null;

  @ApiProperty({ type: String, nullable: true })
  address!: string | null;
}
