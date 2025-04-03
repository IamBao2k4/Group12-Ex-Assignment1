import { HttpStatus } from '@nestjs/common';
import { EnrollmentException } from './enrollment.exception';

export class EnrollmentValidationException extends EnrollmentException {
  constructor(details: string) {
    super(`Enrollment validation failed: ${details}`, HttpStatus.BAD_REQUEST);
  }
} 