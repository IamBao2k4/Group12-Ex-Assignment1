import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Grade } from '../interfaces/grade.interface';
import {
  IGradeRepository,
  GRADE_REPOSITORY,
} from '../repositories/grade.repository.interface';
import { CreateGradeDto, UpdateGradeDto } from '../dtos/grade.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { isValidObjectId } from 'mongoose';
import { GradeNotFoundException } from '../exceptions/grade-not-found.exception';

@Injectable()
export class GradeService {
  private readonly logger = new Logger(GradeService.name);

  constructor(
    @Inject(GRADE_REPOSITORY)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async create(createReq: CreateGradeDto): Promise<Grade> {
    try {
      return await this.gradeRepository.create(createReq);
    } catch (error) {
      this.logger.error(`grade.service.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Grade>> {
    try {
      return await this.gradeRepository.findAll(query, searchString, page);
    } catch (error) {
      this.logger.error(`grade.service.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateReq: UpdateGradeDto): Promise<Grade | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `grade.service.update: Invalid ObjectId format for ID ${id}`,
        );
        throw new GradeNotFoundException(id, true);
      }
      const result = await this.gradeRepository.update(id, updateReq);
      if (!result) {
        throw new GradeNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof GradeNotFoundException) {
        this.logger.error(
          `grade.service.update: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `grade.service.update: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Grade | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `grade.service.delete: Invalid ObjectId format for ID ${id}`,
        );
        throw new GradeNotFoundException(id, true);
      }
      const result = await this.gradeRepository.softDelete(id);
      if (!result) {
        throw new GradeNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof GradeNotFoundException) {
        this.logger.error(
          `grade.service.delete: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `grade.service.delete: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async getAll(): Promise<Grade[]> {
    try {
      return await this.gradeRepository.getAll();
    } catch (error) {
      this.logger.error(`grade.service.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCode(ma: string): Promise<Grade | null> {
    try {
      return await this.gradeRepository.findByCode(ma);
    } catch (error) {
      this.logger.error(
        `grade.service.findByCode: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async detail(id: string): Promise<Grade> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `grade.service.detail: Invalid ObjectId format for ID ${id}`,
        );
        throw new GradeNotFoundException(id, true);
      }
      const grade = await this.gradeRepository.detail(id);
      if (!grade) {
        throw new GradeNotFoundException(id);
      }
      return grade;
    } catch (error) {
      if (error instanceof GradeNotFoundException) {
        this.logger.error(
          `grade.service.detail: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `grade.service.detail: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async getById(id: string): Promise<Grade | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `grade.service.getById: Invalid ObjectId format for ID ${id}`,
        );
        throw new GradeNotFoundException(id, true);
      }
      return await this.gradeRepository.getById(id);
    } catch (error) {
      this.logger.error(`grade.service.getById: ${error.message}`, error.stack);
      throw error;
    }
  }
}
