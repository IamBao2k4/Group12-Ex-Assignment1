import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentIdExistsException extends BaseException {
  constructor(id: string) {
    super(
      `Student ID '${id}' already exists`,
      'STUDENT_ID_EXISTS',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'StudentIdExistsException';
  }
} 