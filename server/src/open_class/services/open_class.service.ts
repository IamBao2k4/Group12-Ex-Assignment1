import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { OpenClass } from '../interfaces/open_class.interface';
import {
  IOpenClassRepository,
  OPEN_CLASS_REPOSITORY,
} from '../repositories/open_class.repository.interface';
import { CreateOpenClassDto, UpdateOpenClassDto } from '../dtos/open_class.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { isValidObjectId } from 'mongoose';
import { OpenClassNotFoundException } from '../exceptions/class-not-found.exception';
import { SearchOptions } from '../dtos/search_options.dto';

@Injectable()
export class OpenClassService {
  private readonly logger = new Logger(OpenClassService.name);

  constructor(
    @Inject(OPEN_CLASS_REPOSITORY)
    private readonly OpenClassRepository: IOpenClassRepository,
  ) {}

  async create(createReq: CreateOpenClassDto): Promise<OpenClass> {
    try {
      return await this.OpenClassRepository.create(createReq);
    } catch (error) {
      this.logger.error(`OpenClass.service.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  async get(
    query: PaginationOptions,
    searchString: SearchOptions,
  ): Promise<PaginatedResponse<OpenClass>> {
    try {
      return await this.OpenClassRepository.findAll(query, searchString);
    } catch (error) {
      this.logger.error(`OpenClass.service.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateReq: UpdateOpenClassDto): Promise<OpenClass | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `OpenClass.service.update: Invalid ObjectId format for ID ${id}`,
        );
        throw new OpenClassNotFoundException(id, true);
      }
      const result = await this.OpenClassRepository.update(id, updateReq);
      if (!result) {
        throw new OpenClassNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof OpenClassNotFoundException) {
        this.logger.error(
          `OpenClass.service.update: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `OpenClass.service.update: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async delete(id: string): Promise<OpenClass | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `OpenClass.service.delete: Invalid ObjectId format for ID ${id}`,
        );
        throw new OpenClassNotFoundException(id, true);
      }
      const result = await this.OpenClassRepository.softDelete(id);
      if (!result) {
        throw new OpenClassNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof OpenClassNotFoundException) {
        this.logger.error(
          `OpenClass.service.delete: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `OpenClass.service.delete: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async getAll(): Promise<OpenClass[]> {
    try {
      return await this.OpenClassRepository.getAll();
    } catch (error) {
      this.logger.error(`OpenClass.service.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  async detail(id: string): Promise<OpenClass> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `OpenClass.service.detail: Invalid ObjectId format for ID ${id}`,
        );
        throw new OpenClassNotFoundException(id, true);
      }
      const OpenClass = await this.OpenClassRepository.detail(id);
      if (!OpenClass) {
        throw new OpenClassNotFoundException(id);
      }
      return OpenClass;
    } catch (error) {
      if (error instanceof OpenClassNotFoundException) {
        this.logger.error(
          `OpenClass.service.detail: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `OpenClass.service.detail: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async getById(id: string): Promise<OpenClass | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(
          `OpenClass.service.getById: Invalid ObjectId format for ID ${id}`,
        );
        throw new OpenClassNotFoundException(id, true);
      }
      return await this.OpenClassRepository.getById(id);
    } catch (error) {
      this.logger.error(`OpenClass.service.getById: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getByStudentId(studentId: string): Promise<OpenClass[] | null> {
    try {
      if (!isValidObjectId(studentId)) {
        this.logger.error(
          `OpenClass.service.getByStudentId: Invalid ObjectId format for ID ${studentId}`,
        );
        throw new OpenClassNotFoundException(studentId, true);
      }
      return await this.OpenClassRepository.getByStudentId(studentId);
    } catch (error) {
      this.logger.error(
        `OpenClass.service.getByStudentId: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
