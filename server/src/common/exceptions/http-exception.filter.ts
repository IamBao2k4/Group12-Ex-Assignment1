import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from "./base.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

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
      // Xử lý exception tùy chỉnh của ứng dụng
      status = exception.getStatus();
      const responseBody = exception.getResponse() as any;
      message = responseBody.message || exception.message;
      error = exception.name;
      errorCode = responseBody.errorCode || 'UNKNOWN_ERROR';
      details = responseBody.details;
    } else if (exception instanceof HttpException) {
      // Xử lý các HTTP exceptions tiêu chuẩn của NestJS
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message = typeof responseBody === 'object' && 'message' in responseBody
        ? (Array.isArray(responseBody.message)
          ? responseBody.message[0]
          : responseBody.message as string)
        : exception.message;
      error = exception.name;
    } else if (exception instanceof Error) {
      // Xử lý các lỗi JavaScript/TypeScript cơ bản
      message = exception.message;
      error = exception.name;
    }

    // Log lỗi
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Trả về response chuẩn hóa
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