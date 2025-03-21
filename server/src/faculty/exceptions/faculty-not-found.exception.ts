import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class FacultyNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Không tìm thấy khoa với ID ${id}`,
      'FACULTY_NOT_FOUND',
      HttpStatus.BAD_REQUEST 
    );
    this.name = 'FacultyNotFoundException';
  }
} 