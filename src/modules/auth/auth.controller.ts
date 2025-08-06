import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login.request.dto';
import { LogoutRequestDto } from './dto/logout.request.dto';
import { SuccessResult } from 'src/common/responses/successResult';
import { LoginResponseDto } from './dto/login.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<SuccessResult<LoginResponseDto>> {
    return await this.authService.login(loginRequestDto);
  }

  @Post('logout')
  async logout(@Body() logoutRequestDto: LogoutRequestDto): Promise<SuccessResult> {
    return await this.authService.logout(logoutRequestDto);
  }
}