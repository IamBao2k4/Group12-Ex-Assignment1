import { Injectable, Logger, LoggerService, Scope } from '@nestjs/common';
import { Request, Response } from 'express';
import { IErrorResponse } from '../exceptions/base.exception';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export interface ApiLogData {
  method: string;
  path: string;
  statusCode?: number;
  responseTime?: number;
  userId?: string;
  requestBody?: any;
  responseBody?: any;
  errorDetails?: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class ApiLoggerService extends Logger {
  private contextName: string;

  constructor(context?: string) {
    super(context || 'API');
    this.contextName = context || 'API';
  }

  logApiRequest(req: Request, data?: Partial<ApiLogData>): void {
    const logData: ApiLogData = {
      method: req.method,
      path: req.path,
      userId: req.headers['x-user-id'] as string || 'anonymous',
      requestBody: req.body,
      ...data,
    };

    this.log(`${logData.method} ${logData.path} - Request received`);
    
  }

  logApiResponse(req: Request, res: Response, data?: Partial<ApiLogData>): void {
    const responseTime = res.getHeader('X-Response-Time') 
      ? Number(res.getHeader('X-Response-Time'))
      : undefined;
    
    const logData: ApiLogData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      userId: req.headers['x-user-id'] as string || 'anonymous',
      ...data,
    };

    this.log(
      `${logData.method} ${logData.path} - ${logData.statusCode} - ${
        responseTime ? `${responseTime}ms` : ''
      }`
    );
    
  }

  logApiError(req: Request, error: any, data?: Partial<ApiLogData>): void {
    const logData: ApiLogData = {
      method: req.method,
      path: req.path,
      statusCode: error.status || 500,
      userId: req.headers['x-user-id'] as string || 'anonymous',
      errorDetails: this.formatErrorDetails(error),
      ...data,
    };

    this.error(
      `${logData.method} ${logData.path} - ${logData.statusCode} - ${
        error.message || 'Internal server error'
      }`
    );

    if (process.env.NODE_ENV === 'development') {
      this.verbose(`Error Details: ${JSON.stringify(logData.errorDetails || {})}`);
    }

    if (error.stack) {
      this.verbose(error.stack);
    }
  }

  private formatErrorDetails(error: any): any {
    if (!error) return {};

    if (error.response && typeof error.response === 'object') {
      const errorResponse = error.response as IErrorResponse;
      return {
        message: errorResponse.message,
        errorCode: errorResponse.errorCode,
        details: errorResponse.details,
      };
    }

    return {
      message: error.message,
      name: error.name,
    };
  }
} 