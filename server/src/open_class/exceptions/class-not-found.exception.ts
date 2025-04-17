import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class OpenClassNotFoundException extends BaseException {
  constructor(id: string, isInvalidId: boolean = false) {
    const message = isInvalidId
      ? `ID is invalid: ${id}. ID must be a valid ObjectId.`
      : `Open Class with ID ${id} not found`;

    super(message, 'OPEN_CLASS_NOT_FOUND', HttpStatus.BAD_REQUEST);
    this.name = 'OpenClassNotFoundException';
  }
}
