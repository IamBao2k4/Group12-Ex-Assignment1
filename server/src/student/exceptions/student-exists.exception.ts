import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentExistsException extends BaseException {
  constructor() {
    super(
      'Email or phone number already exists',
      'STUDENT_EXISTS',
      HttpStatus.BAD_REQUEST,
    );
    this.name = 'StudentExistsException';
  }
} 