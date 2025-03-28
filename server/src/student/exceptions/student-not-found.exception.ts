import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentNotFoundException extends BaseException {
  constructor(id: string, isInvalidId: boolean = false) {
    const message = isInvalidId
      ? `ID is invalid: ${id}. ID must be a valid ObjectId.`
      : `Student with ID ${id} not found`;
      
    super(
      message,
      'STUDENT_NOT_FOUND',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'StudentNotFoundException';
  }
} 