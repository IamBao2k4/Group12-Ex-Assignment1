import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentStatus } from '../interfaces/student_status.interface';
import { IStudentStatusRepository } from './student_status.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { StudentStatusNotFoundException } from '../exceptions/student_status-not-found.exception';
import { isValidObjectId } from '../../common/utils/validation.util';

@Injectable()
export class StudentStatusRepository implements IStudentStatusRepository {
  private readonly logger = new Logger(StudentStatusRepository.name);

  constructor(@InjectModel('StudentStatus') private studentStatusModel: Model<StudentStatus>) {}

  async create(studentStatusData: any): Promise<StudentStatus> {
    const studentStatus = new this.studentStatusModel(studentStatusData);
    let createdStudentStatus: StudentStatus | null = null;
    try {
      createdStudentStatus = await studentStatus.save();
    } catch (error) {
      this.logger.error('student_status.repository.create: Error creating student status', error.stack);
      throw new BaseException(error, 'CREATE_STUDENT_STATUS_ERROR');
    }
    return createdStudentStatus;
  }

  async update(id: string, studentStatusData: Partial<StudentStatus>): Promise<StudentStatus | null> {
    try {
      const updatedStudentStatus = await this.studentStatusModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }]
          },
          studentStatusData,
          { new: true }
        )
        .exec();
      
      if (!updatedStudentStatus) {
        throw new StudentStatusNotFoundException(id);
      }
      
      return updatedStudentStatus;
    } catch (error) {
      if (error instanceof StudentStatusNotFoundException) {
        throw error;
      }
      this.logger.error(`student_status.repository.update: Error updating student status with ID ${id}`, error.stack);
      throw new BaseException(error, 'UPDATE_STUDENT_STATUS_ERROR');
    }
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<StudentStatus>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();

    let query = {};

    if (searchString) {
      query = {
        $and: [
          {
            $or: [
              { description: { $regex: searchString, $options: 'i' } },
              { name: { $regex: searchString, $options: 'i' } },
            ],
          },
          {
            $or: [
              { deleted_at: { $exists: false } },
              { deleted_at: null },
            ],
          },
        ],
      };
    } else {
      query = { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] };
    }
    let studentStatuses: StudentStatus[] = [];
    try {
      studentStatuses = await this.studentStatusModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.error('student_status.repository.findAll: Error finding student statuses', error.stack);
      throw new BaseException(error, 'FIND_ALL_STUDENT_STATUS_ERROR');
    }

    let total = 0;
    try {
      total = await this.studentStatusModel.countDocuments({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] });
    } catch (error) {
      this.logger.error('student_status.repository.findAll: Error counting student statuses', error.stack);
      throw new BaseException(error, 'COUNT_STUDENT_STATUSES_ERROR');
    }
    
    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<StudentStatus>(
      studentStatuses,
      page,
      limit,
      total,
      totalPages,
    );
  }

  async softDelete(id: string): Promise<StudentStatus | null> {
    try {
      const deletedStudentStatus = await this.studentStatusModel
        .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
        .exec();
      
      if (!deletedStudentStatus) {
        throw new StudentStatusNotFoundException(id);
      }
      
      return deletedStudentStatus;
    } catch (error) {
      if (error instanceof StudentStatusNotFoundException) {
        throw error;
      }
      this.logger.error(`student_status.repository.softDelete: Error deleting student status with ID ${id}`, error.stack);
      throw new BaseException(error, 'DELETE_STUDENT_STATUS_ERROR');
    }
  }

  async getAll(): Promise<StudentStatus[]> {
    let studentStatuses: StudentStatus[] = [];
    try {
      studentStatuses = await this.studentStatusModel.find({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error('student_status.repository.getAll: Error getting all student statuses', error.stack);
      throw new BaseException(error, 'GET_ALL_STUDENT_STATUSES_ERROR');
    }
    return studentStatuses;
  }

  async getOne(id: string): Promise<StudentStatus> {
    let studentStatus: StudentStatus | null = null;
    try {
      studentStatus = await this.studentStatusModel.findOne({ _id: id, $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
      this.logger.log(`Found student status by ID: ${studentStatus?._id}`);
    } catch (error) {
      if (error instanceof StudentStatusNotFoundException) {
        throw error;
      }
      this.logger.error(`Error getting student status by ID: ${id}`, error.stack);
      throw new BaseException(error, 'GET_ONE_STUDENT_STATUS_ERROR');
    }
    if (!studentStatus) {
      this.logger.warn(`Student status not found with ID: ${id}`);
      throw new StudentStatusNotFoundException(id);
    }
    return studentStatus;
  }
}