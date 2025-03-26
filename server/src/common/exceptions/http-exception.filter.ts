import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from "./base.exception";
import { ApiLoggerService } from '../logger/api-logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new ApiLoggerService(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi không xác định';
    let error = 'Internal Server Error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let details = undefined;

    if (exception instanceof BaseException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse() as any;
      message = responseBody.message || exception.message;
      error = exception.name;
      errorCode = responseBody.errorCode || 'UNKNOWN_ERROR';
      details = responseBody.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message = typeof responseBody === 'object' && 'message' in responseBody
        ? (Array.isArray(responseBody.message)
          ? responseBody.message[0]
          : responseBody.message as string)
        : exception.message;
      error = exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    this.logger.logApiError(request, {
      status,
      message,
      name: error,
      errorCode,
      details,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json({
      statusCode: status,
      message,
      errorCode,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}