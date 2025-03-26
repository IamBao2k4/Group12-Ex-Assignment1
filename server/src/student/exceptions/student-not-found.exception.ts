import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Student with ID ${id} not found`,
      'STUDENT_NOT_FOUND',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'StudentNotFoundException';
  }
} 