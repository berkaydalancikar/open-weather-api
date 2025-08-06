import { IsString } from 'class-validator';

export class CreateUserResponseDto {
  @IsString()
  id: string;
}