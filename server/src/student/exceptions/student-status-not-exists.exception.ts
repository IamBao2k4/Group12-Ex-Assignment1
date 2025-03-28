import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentStatusNotExistsException extends BaseException {
  constructor(id: string) {
    super(
      `Student status with ID '${id}' does not exist`,
      'STUDENT_STATUS_NOT_EXISTS',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'StudentStatusNotExistsException';
  }
} 