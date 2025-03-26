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
    let details: Record<string, string[]> | undefined = undefined;

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
      
      if (typeof responseBody === 'object') {
        if ('message' in responseBody) {
          if ('errors' in responseBody) {
            const validationResponse = responseBody as { 
              message: string;
              errors: Record<string, string[]>;
            };
            
            this.logger.error(`Validation errors: ${JSON.stringify(validationResponse.errors)}`);
            
            if (validationResponse.errors.email) {
              message = `Email validation error: ${validationResponse.errors.email[0]}`;
            }
            else if (validationResponse.errors.so_dien_thoai) {
              message = `Phone validation error: ${validationResponse.errors.so_dien_thoai[0]}`;
            }
            else {
              const firstKey = Object.keys(validationResponse.errors)[0];
              if (firstKey) {
                message = `${firstKey} validation error: ${validationResponse.errors[firstKey][0]}`;
              } else {
                message = 'Validation error';
              }
            }
            
            details = validationResponse.errors;
          } else {
            message = Array.isArray(responseBody.message)
              ? responseBody.message[0]
              : responseBody.message as string;
          }
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
      
      error = exception.name;
      
      if (exception.name === 'BadRequestException') {
        errorCode = 'BAD_REQUEST';
      } else if (exception.name === 'UnauthorizedException') {
        errorCode = 'UNAUTHORIZED';
      } else if (exception.name === 'ForbiddenException') {
        errorCode = 'FORBIDDEN';
      } else if (exception.name === 'NotFoundException') {
        errorCode = 'NOT_FOUND';
      } else {
        errorCode = exception.name.replace('Exception', '').toUpperCase();
      }
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