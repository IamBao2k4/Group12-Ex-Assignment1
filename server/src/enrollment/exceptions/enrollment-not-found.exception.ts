import { HttpStatus } from '@nestjs/common';
import { EnrollmentException } from './enrollment.exception';

export class EnrollmentNotFoundException extends EnrollmentException {
  constructor(id: string) {
    super(`Enrollment with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
} 