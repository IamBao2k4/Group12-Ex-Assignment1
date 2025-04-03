import { HttpStatus } from '@nestjs/common';
import { EnrollmentException } from './enrollment.exception';

export class EnrollmentConflictException extends EnrollmentException {
  constructor(ma_sv: string, ma_mon: string, ma_lop: string, details?: string) {
    const message = details 
      ? `Conflict with enrollment for student ${ma_sv}, course ${ma_mon}, class ${ma_lop}: ${details}` 
      : `Conflict with enrollment for student ${ma_sv}, course ${ma_mon}, class ${ma_lop}`;
    super(message, HttpStatus.CONFLICT);
  }
} 