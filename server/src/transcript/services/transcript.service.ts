import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Transcript } from '../interfaces/transcript.interface';
import {
  ITranscriptRepository,
  TRANSCRIPT_REPOSITORY,
} from '../repositories/transcript.repository.interface';
import {
  CreateTranscriptDto,
  UpdateTranscriptDto,
} from '../dtos/transcript.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { isValidObjectId } from 'mongoose';
import { TranscriptNotFoundException } from '../exceptions/transcript-not-found.exception';
import { SearchOptions } from '../dtos/search_options.dto';

@Injectable()
export class TranscriptService {
  private readonly logger = new Logger(TranscriptService.name);

  constructor(
    @Inject(TRANSCRIPT_REPOSITORY)
    private readonly transcriptRepository: ITranscriptRepository,
  ) {}

  async create(createReq: CreateTranscriptDto): Promise<Transcript> {
    try {
      return await this.transcriptRepository.create(createReq);
    } catch (error) {
      this.logger.error(
        `transcript.service.create: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Transcript>> {
    try {
      return await this.transcriptRepository.findAll(query, searchString, page);
    } catch (error) {
      this.logger.error(
        `transcript.service.get: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateReq: UpdateTranscriptDto,
  ): Promise<Transcript | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `transcript.service.update: Invalid ObjectId format for ID ${id}`,
        );
        throw new TranscriptNotFoundException(id, true);
      }
      const result = await this.transcriptRepository.update(id, updateReq);
      if (!result) {
        throw new TranscriptNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof TranscriptNotFoundException) {
        this.logger.error(
          `transcript.service.update: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `transcript.service.update: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Transcript | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `transcript.service.delete: Invalid ObjectId format for ID ${id}`,
        );
        throw new TranscriptNotFoundException(id, true);
      }
      const result = await this.transcriptRepository.softDelete(id);
      if (!result) {
        throw new TranscriptNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof TranscriptNotFoundException) {
        this.logger.error(
          `transcript.service.delete: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `transcript.service.delete: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async findByStudentId(
    studentId: string,
    paginationOpts: PaginationOptions,
    searchString: SearchOptions,
  ): Promise<PaginatedResponse<Transcript>> {
    try {
      return await this.transcriptRepository.findByStudentId(
        studentId,
        paginationOpts,
        searchString,
      );
    } catch (error) {
      this.logger.error(
        `transcript.service.findByStudentId: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<Transcript[] | null> {
    try {
      return await this.transcriptRepository.findByCourseId(courseId);
    } catch (error) {
      this.logger.error(
        `transcript.service.findByCourseId: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
