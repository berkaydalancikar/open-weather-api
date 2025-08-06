import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/createUser.request.dto';
import { ApiTags } from '@nestjs/swagger';
import { ROLES } from 'src/common/constants';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { SuccessResult } from 'src/common/responses/successResult';
import { CreateUserResponseDto } from './dto/createUser.response.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @Auth(ROLES.ADMIN)
  async getUsers(): Promise<SuccessResult<UserDto[]>> {
    return await this.userService.getUsers();
  }

  @Post('create')
  @Auth(ROLES.ADMIN)
  async createUser(@Body() createUserDto: CreateUserRequestDto): Promise<SuccessResult<CreateUserResponseDto>> {
    return await this.userService.createUser(createUserDto);
  }
}