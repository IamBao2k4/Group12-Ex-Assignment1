import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class ProgramNotFoundException extends BaseException {
  constructor(id: string) {
    super(
      `Program with ID ${id} not found`,
      'PROGRAM_NOT_FOUND',
      HttpStatus.BAD_REQUEST 
    );
    this.name = 'ProgramNotFoundException';
  }
}