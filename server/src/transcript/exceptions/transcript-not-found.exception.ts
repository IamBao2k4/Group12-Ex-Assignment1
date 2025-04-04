import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../common/exceptions';

export class TranscriptNotFoundException extends BaseException {
  constructor(id: string, isInvalidId: boolean = false) {
    const message = isInvalidId
      ? `ID is invalid: ${id}. ID must be a valid ObjectId.`
      : `Transcript with ID ${id} not found`;

    super(message, 'TRANSCRIPT_NOT_FOUND', HttpStatus.BAD_REQUEST);
    this.name = 'TranscriptNotFoundException';
  }
}
