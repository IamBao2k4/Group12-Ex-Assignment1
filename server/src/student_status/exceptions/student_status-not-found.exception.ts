import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class StudentStatusNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Không tìm thấy trạng thái sinh viên với ID ${id}`,
      'STUDENT_STATUS_NOT_FOUND',
      HttpStatus.BAD_REQUEST 
    );
    this.name = 'StudentStatusNotFoundException';
  }
}