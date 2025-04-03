import { HttpStatus } from '@nestjs/common';
import { EnrollmentException } from './enrollment.exception';

export class EnrollmentUpsertFailedException extends EnrollmentException {
  constructor(details?: string) {
    const message = details 
      ? `Failed to upsert enrollment: ${details}` 
      : 'Failed to upsert enrollment';
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
} 