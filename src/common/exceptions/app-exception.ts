import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly error: { message: string; code: number, status: HttpStatus },
  ) {
    super(error, error.status);
  }
}
