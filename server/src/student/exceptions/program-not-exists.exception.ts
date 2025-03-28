import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class ProgramNotExistsException extends BaseException {
  constructor(id: string) {
    super(
      `Program with ID '${id}' does not exist`,
      'PROGRAM_NOT_EXISTS',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'ProgramNotExistsException';
  }
} 