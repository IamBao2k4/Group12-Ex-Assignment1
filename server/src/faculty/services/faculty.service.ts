import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Faculty } from '../interfaces/faculty.interface';
import { IFacultyRepository, FACULTY_REPOSITORY } from '../repositories/faculty.repository.interface';
import { CreateFacultyDto, UpdateFacultyDto } from '../dtos/faculty.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { isValidObjectId } from 'mongoose';
import { FacultyNotFoundException } from '../exceptions/faculty-not-found.exception';

@Injectable()
export class FacultyService {
  private readonly logger = new Logger(FacultyService.name);

  constructor(
    @Inject(FACULTY_REPOSITORY) private readonly facultyRepository: IFacultyRepository,
  ) {}

  async create(createReq: CreateFacultyDto): Promise<Faculty> {
    try {
      return await this.facultyRepository.create(createReq);
    } catch (error) {
      this.logger.error(`faculty.service.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Faculty>> {
    try {
      return await this.facultyRepository.findAll(query, searchString, page);
    } catch (error) {
      this.logger.error(`faculty.service.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateReq: UpdateFacultyDto): Promise<Faculty | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`faculty.service.update: Invalid ObjectId format for ID ${id}`);
        throw new FacultyNotFoundException(id, true);
      }
      const result = await this.facultyRepository.update(id, updateReq);
      if (!result) {
        throw new FacultyNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof FacultyNotFoundException) {
        this.logger.error(`faculty.service.update: ${error.message}`, error.stack);
      } else {
        this.logger.error(`faculty.service.update: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Faculty | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`faculty.service.delete: Invalid ObjectId format for ID ${id}`);
        throw new FacultyNotFoundException(id, true);
      }
      const result = await this.facultyRepository.softDelete(id);
      if (!result) {
        throw new FacultyNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof FacultyNotFoundException) {
        this.logger.error(`faculty.service.delete: ${error.message}`, error.stack);
      } else {
        this.logger.error(`faculty.service.delete: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async getAll(): Promise<Faculty[]> {
    try {
      return await this.facultyRepository.getAll();
    } catch (error) {
      this.logger.error(`faculty.service.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCode(ma: string): Promise<Faculty | null> {
    try {
      return await this.facultyRepository.findByCode(ma);
    } catch (error) {
      this.logger.error(`faculty.service.findByCode: ${error.message}`, error.stack);
      throw error;
    }
  }

  async detail(id: string): Promise<Faculty> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`faculty.service.detail: Invalid ObjectId format for ID ${id}`);
        throw new FacultyNotFoundException(id, true);
      } 
      const faculty = await this.facultyRepository.detail(id);
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${id} not found`);
      }
      return faculty;
    } catch (error) {
      this.logger.error(`faculty.service.detail: ${error.message}`, error.stack);
      throw error;
    }
  }
}