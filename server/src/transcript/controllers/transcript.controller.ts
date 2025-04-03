import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TranscriptService } from '../services/transcript.service';
import {
  CreateTranscriptDto,
  UpdateTranscriptDto,
} from '../dtos/transcript.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { Transcript } from '../interfaces/transcript.interface';
import { BaseException } from '../../common/exceptions/base.exception';

@Controller('transcripts')
export class TranscriptController {
  constructor(private readonly transcriptService: TranscriptService) {}
  private readonly logger = new Logger(TranscriptController.name);

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createReq: CreateTranscriptDto) {
    return this.transcriptService.create(createReq);
  }

  @Get()
  async get(
    @Query() query: PaginationOptions,
    @Query('searchString') searchString: string,
    @Query('page') page: number,
  ): Promise<PaginatedResponse<Transcript>> {
    return this.transcriptService.get(query, searchString, page);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const sanitizedId = id.trim();
    return this.transcriptService.delete(sanitizedId);
  }
}
