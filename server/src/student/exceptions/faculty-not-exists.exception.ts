import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class FacultyNotExistsException extends BaseException {
  constructor(id: string) {
    super(
      `Faculty with ID '${id}' does not exist`,
      'FACULTY_NOT_EXISTS',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'FacultyNotExistsException';
  }
} 