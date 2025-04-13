import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class OpenClassConflictException extends BaseException {
  constructor(code: string) {
    super(
      `Open Class with code ${code} already exists`,
      'OPEN_CLASS_CONFLICT',
      HttpStatus.CONFLICT,
    );
    this.name = 'OpenClassConflictException';
  }
} 