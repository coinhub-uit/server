import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSourceDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  balance: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
