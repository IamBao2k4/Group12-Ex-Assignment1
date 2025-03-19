import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentStatus } from '../interfaces/student_status.interface';
import { IStudentStatusRepository } from './student_status.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { StudentStatusNotFoundException } from '../exceptions/student_status-not-found.exception';

@Injectable()
export class StudentStatusRepository implements IStudentStatusRepository {
  constructor(@InjectModel('StudentStatus') private studentStatusModel: Model<StudentStatus>) {}

  async create(studentStatusData: any): Promise<StudentStatus> {
    const studentStatus = new this.studentStatusModel(studentStatusData);
    let createdStudentStatus: StudentStatus | null = null;
    try {
      createdStudentStatus = await studentStatus.save();
    } catch (error) {
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
        $or: [
          { tinh_trang: { $regex: searchString, $options: 'i' } },
          { deleted_at: { $exists: false } }, { deleted_at: null }
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
      throw new BaseException(error, 'FIND_ALL_STUDENT_STATUS_ERROR');
    }

    let total = 0;
    try {
      total = await this.studentStatusModel.countDocuments({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] });
    } catch (error) {
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
      throw new BaseException(error, 'DELETE_STUDENT_STATUS_ERROR');
    }
  }
}