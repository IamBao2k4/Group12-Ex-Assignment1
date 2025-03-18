import { HttpException, HttpStatus } from '@nestjs/common';

export interface IErrorResponse {
  message: string;
  errorCode: string;
  statusCode: number;
  details?: any;
}

export class BaseException extends HttpException {
  constructor(
    message: string,
    errorCode: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any,
  ) {
    const errorResponse: IErrorResponse = {
      message,
      errorCode,
      statusCode,
      details,
    };
    super(errorResponse, statusCode);
  }
} 