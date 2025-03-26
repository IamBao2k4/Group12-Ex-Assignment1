import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { StudentStatus } from '../interfaces/student_status.interface';
import { IStudentStatusRepository, STUDENT_STATUS_REPOSITORY } from '../repositories/student_status.repository.interface';
import { CreateStudentStatusDto, UpdateStudentStatusDto } from '../dtos/student_status.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentStatusNotFoundException } from '../exceptions/student_status-not-found.exception';

@Injectable()
export class StudentStatusService {
  private readonly logger = new Logger(StudentStatusService.name);

  constructor(
    @Inject(STUDENT_STATUS_REPOSITORY) private readonly studentStatusRepository: IStudentStatusRepository,
    @InjectModel('StudentStatus') private studentStatusModel: Model<StudentStatus>
  ) {}

  async create(createReq: CreateStudentStatusDto): Promise<StudentStatus> {
    try {
      return await this.studentStatusRepository.create(createReq);
    } catch (error) {
      this.logger.error(`student_status.service.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<StudentStatus>> {
    try {
      return await this.studentStatusRepository.findAll(query, searchString, page);
    } catch (error) {
      this.logger.error(`student_status.service.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateReq: UpdateStudentStatusDto): Promise<StudentStatus | null> {
    try {
      const result = await this.studentStatusRepository.update(id, updateReq);
      if (!result) {
        throw new StudentStatusNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof StudentStatusNotFoundException) {
        this.logger.error(`student_status.service.update: ${error.message}`, error.stack);
      } else {
        this.logger.error(`student_status.service.update: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<StudentStatus | null> {
    try {
      const result = await this.studentStatusRepository.softDelete(id);
      if (!result) {
        throw new StudentStatusNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof StudentStatusNotFoundException) {
        this.logger.error(`student_status.service.delete: ${error.message}`, error.stack);
      } else {
        this.logger.error(`student_status.service.delete: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async getAll(): Promise<StudentStatus[]> {
    try {
      return await this.studentStatusModel.find().exec();
    } catch (error) {
      this.logger.error(`student_status.service.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getOne(id: string): Promise<StudentStatus> {
    return this.studentStatusRepository.getOne(id);
  }
}