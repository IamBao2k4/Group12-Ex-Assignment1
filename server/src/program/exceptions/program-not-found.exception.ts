import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class ProgramNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Không tìm thấy chương trình với ID ${id}`,
      'PROGRAM_NOT_FOUND',
      HttpStatus.BAD_REQUEST 
    );
    this.name = 'ProgramNotFoundException';
  }
}