import { HttpException, HttpStatus } from '@nestjs/common';

export class EnrollmentException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(
      {
        statusCode,
        message,
        error: 'Enrollment Error',
      },
      statusCode,
    );
  }
} 