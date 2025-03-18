import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentExistsException extends BaseException {
  constructor() {
    super(
      'Email hoặc số điện thoại đã tồn tại',
      'STUDENT_EXISTS',
      HttpStatus.BAD_REQUEST,
    );
    this.name = 'StudentExistsException';
  }
} 