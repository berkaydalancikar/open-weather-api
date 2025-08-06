import type {
  ExceptionFilter,
  ArgumentsHost} from '@nestjs/common';
import {
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code: number | undefined;
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else {
        message = res['message'] ?? res['error']['message'] ?? 'Internal server error';
        code = res['error']?.['code'] || res['code'];
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    response.status(status).json({
      success: false,
      code,
      message: stack ? undefined : message,
      stack,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }
}
