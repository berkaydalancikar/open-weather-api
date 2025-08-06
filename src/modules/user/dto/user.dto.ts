import { IsNumber, IsString } from 'class-validator';

enum Roles {
  ADMIN = 1,
  USER = 2,
}

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  password?: string;

  @IsNumber()
  role: Roles;

  constructor(data: { id: string, email: string, password?: string, role: Roles }) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password && undefined;
    this.role = data.role;
  }
}