import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transcript } from '../interfaces/transcript.interface';
import { ITranscriptRepository } from './transcript.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { TranscriptNotFoundException } from '../exceptions/transcript-not-found.exception';

@Injectable()
export class TranscriptRepository implements ITranscriptRepository {
  private readonly logger = new Logger(TranscriptRepository.name);

  constructor(
    @InjectModel('Transcript') private transcriptModel: Model<Transcript>,
  ) {}

  async create(transcriptData: any): Promise<Transcript> {
    const transcript = new this.transcriptModel(transcriptData);
    let createdTranscript: Transcript | null = null;
    try {
      createdTranscript = await transcript.save();
    } catch (error) {
      this.logger.error(
        'transcript.repository.create: Error creating transcript',
        error.stack,
      );
      throw new BaseException(error, 'CREATE_TRANSCRIPT_ERROR');
    }
    return createdTranscript;
  }

  async update(
    id: string,
    transcriptData: Partial<Transcript>,
  ): Promise<Transcript | null> {
    try {
      const updatedTranscript = await this.transcriptModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
          },
          transcriptData,
          { new: true },
        )
        .exec();

      if (!updatedTranscript) {
        throw new TranscriptNotFoundException(id);
      }

      return updatedTranscript;
    } catch (error) {
      if (error instanceof TranscriptNotFoundException) {
        throw error;
      }
      this.logger.error(
        `transcript.repository.update: Error updating transcript with ID ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'UPDATE_TRANSCRIPT_ERROR');
    }
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Transcript>> {
    const padination = new Pagination(paginationOpts);
    const skip = padination.Skip();
    const limit = padination.Limit();

    let query = {};

    if (searchString) {
      query = {
        $and: [
          {
            $or: [
              { ma_mon_hoc: { $regex: searchString, $options: 'i' } },
              { ma_so_sinh_vien: { $regex: searchString, $options: 'i' } },
            ],
          },
          {
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
          },
        ],
      };
    } else {
      query = {
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
      };
    }

    let transcripts: Transcript[] = [];
    try {
      transcripts = await this.transcriptModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.error(
        'transcript.repository.findAll: Error finding transcripts',
        error.stack,
      );
      throw new BaseException(error, 'FIND_TRANSCRIPTS_ERROR');
    }

    let total = 0;
    try {
      total = await this.transcriptModel.countDocuments({
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
      });
    } catch (error) {
      this.logger.error(
        'transcript.repository.findAll: Error counting transcripts',
        error.stack,
      );
      throw new BaseException(error, 'COUNT_TRANSCRIPTS_ERROR');
    }

    const totalPages = padination.TotalPages(total);

    return new PaginatedResponse<Transcript>(
      transcripts,
      page,
      limit,
      total,
      totalPages,
    );
  }

  async softDelete(id: string): Promise<Transcript | null> {
    try {
      const updatedTranscript = await this.transcriptModel
        .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
        .exec();

      if (!updatedTranscript) {
        throw new TranscriptNotFoundException(id);
      }

      return updatedTranscript;
    } catch (error) {
      if (error instanceof TranscriptNotFoundException) {
        throw error;
      }
      this.logger.error(
        `transcript.repository.softDelete: Error deleting transcript with ID ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'SOFT_DELETE_TRANSCRIPT_ERROR');
    }
  }

  async findByStudentId(studentId: string): Promise<Transcript[] | null> {
    try {
      const transcript = await this.transcriptModel
        .find({
          ma_so_sinh_vien: studentId,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();

      if (!transcript) {
        throw new TranscriptNotFoundException(studentId);
      }

      return transcript;
    } catch (error) {
      if (error instanceof TranscriptNotFoundException) {
        throw error;
      }
      this.logger.error(
        `transcript.repository.findByStudentId: Error finding transcript for student ID ${studentId}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_TRANSCRIPT_BY_STUDENT_ID_ERROR');
    }
  }

  async findByCourseId(courseId: string): Promise<Transcript[] | null> {
    try {
      const transcript = await this.transcriptModel
        .find({
          ma_mon_hoc: courseId,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();

      if (!transcript) {
        throw new TranscriptNotFoundException(courseId);
      }

      return transcript;
    } catch (error) {
      if (error instanceof TranscriptNotFoundException) {
        throw error;
      }
      this.logger.error(
        `transcript.repository.findByCourseId: Error finding transcript for course ID ${courseId}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_TRANSCRIPT_BY_COURSE_ID_ERROR');
    }
  }
}
