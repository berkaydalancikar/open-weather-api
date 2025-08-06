import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AppException } from 'src/common/exceptions/app-exception';
import { DatabaseService } from 'src/core/database/database.service';
import { TOKEN_TYPES } from 'src/common/constants';
import { getExpiresAt } from './utils';
import { ERRORS } from 'src/common/errors';
import { SuccessResult } from 'src/common/responses/successResult';
import { LoginRequestDto } from './dto/login.request.dto';
import { LogoutRequestDto } from './dto/logout.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
  ) {}

  async login(loginRequestDto: LoginRequestDto): Promise<SuccessResult<LoginResponseDto>> {
    const user = await this.userService.getUser(loginRequestDto.email);

    if (user.password && !(await compare(loginRequestDto.password, user.password))) {
      throw new AppException(ERRORS.INVALID_CREDENTIALS);
    }

    const expireTime = process.env.ACCESS_TOKEN_EXPIRE_TIME || '15m';
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: expireTime });

    try {
      await this.databaseService.$transaction([
        this.databaseService.tokens.updateMany({
          where: { userId: user.id, isActive: true },
          data: { isActive: false },
        }),
        this.databaseService.tokens.create({
          data: {
            userId: user.id,
            token: accessToken,
            type: TOKEN_TYPES.ACCESS,
            expiresAt: getExpiresAt(expireTime),
          },
        }),
      ]);
    } catch (error) {
      throw new AppException(error);
    } 

    return new SuccessResult({ accessToken });
  }

  async logout(logoutRequestDto: LogoutRequestDto): Promise<SuccessResult> {
    try {
      const user = await this.userService.getUser(logoutRequestDto.userId);

      if (!user) {
        throw new AppException(ERRORS.USER_NOT_FOUND);
      }

      await this.databaseService.tokens.updateMany({
        where: { userId: logoutRequestDto.userId, isActive: true },
        data: { isActive: false }
      });
    } catch (error) {
      throw new AppException(error);
    }

    return new SuccessResult({});
  }
}