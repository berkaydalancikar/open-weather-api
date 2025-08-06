import { Injectable } from '@nestjs/common';
import { AppException } from 'src/common/exceptions/app-exception';
import { DatabaseService } from 'src/core/database/database.service';
import { CreateUserRequestDto } from './dto/createUser.request.dto';
import { hash } from 'bcrypt';  
import { ERRORS } from 'src/common/errors';
import { SuccessResult } from 'src/common/responses/successResult';
import { CreateUserResponseDto } from './dto/createUser.response.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers(): Promise<SuccessResult<UserDto[]>> {
    try {
      const users = await this.databaseService.users.findMany({
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      return new SuccessResult(users.map(user => new UserDto(user)));
    } catch(error) {
      throw new AppException(error);
    }
  }

  async createUser(createUserDto: CreateUserRequestDto): Promise<SuccessResult<CreateUserResponseDto>> {
    try {
      const user = await this.databaseService.users.findUnique({
        where: { email: createUserDto.email },
      })

      if (user) {
        throw new AppException(ERRORS.USER_ALREADY_EXISTS);
      }


      const newUser = await this.databaseService.users.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, 10),
          role: createUserDto.role,
        }
      });

      return new SuccessResult({ id: newUser.id });
    } catch(error) {
      throw new AppException(error);
    }
  }

  async getUser(email: string): Promise<UserDto> {
    try {
      const user = await this.databaseService.users.findUnique({ where: { email } });

      if(user) {
        return new UserDto(user);
      } else {
        throw new AppException(ERRORS.USER_NOT_FOUND);
      }
    } catch(error) {
      throw new AppException(error);
    }
  }
}
