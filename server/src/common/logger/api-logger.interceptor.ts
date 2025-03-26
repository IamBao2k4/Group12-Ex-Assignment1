import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiLoggerService } from './api-logger.service';

@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  private readonly logger = new ApiLoggerService(ApiLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    
    this.logger.logApiRequest(request);

    return next.handle().pipe(
      tap(data => {
        const responseTime = Date.now() - startTime;
        response.setHeader('X-Response-Time', `${responseTime}`);
        
        this.logger.logApiResponse(request, response, {
          responseTime,
          responseBody: data
        });
      }),
      catchError(error => {
        const responseTime = Date.now() - startTime;
        
        this.logger.logApiError(request, error, {
          responseTime
        });
        
        throw error;
      })
    );
  }
} 