import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class InvalidStatusTransitionException extends BaseException {
  constructor(fromStatus: string, toStatus: string) {
    super(
      `Invalid status transition from '${fromStatus}' to '${toStatus}'`,
      'INVALID_STATUS_TRANSITION',
      HttpStatus.BAD_REQUEST
    );
    this.name = 'InvalidStatusTransitionException';
  }
} 