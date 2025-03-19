import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Không tìm thấy sinh viên với ID ${id}`,
      'STUDENT_NOT_FOUND',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'StudentNotFoundException';
  }
} 