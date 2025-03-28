import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../interfaces/student.interface';
import { IStudentRepository } from './student.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { StudentNotFoundException } from '../exceptions/student-not-found.exception';

@Injectable()
export class StudentRepository implements IStudentRepository {
  private readonly logger = new Logger(StudentRepository.name);

  constructor(@InjectModel('Student') private studentModel: Model<Student>) {}

  async create(studentData: any): Promise<Student> {
    const student = new this.studentModel(studentData);
    let createdStudent: Student | null = null;
    try {
      createdStudent = await student.save();
    } catch (error) {
      this.logger.error('student.repository.create: Error creating student', error.stack);
      throw new BaseException(error, 'CREATE_STUDENT_ERROR');
    }
    return createdStudent;
  }

  async findByEmailOrPhone(email: string, so_dien_thoai: string, excludeId?: string): Promise<Student | null> {
    const query: any = {
      $and: [
        { $or: [{ email }, { so_dien_thoai }] },
        { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }
      ]
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    let student: Student | null = null;
    try {
      student = await this.studentModel.findOne(query).exec();
    } catch (error) {
      this.logger.error('student.repository.findByEmailOrPhone: Error finding student', error.stack);
      throw new BaseException(error, 'FIND_STUDENT_BY_EMAIL_OR_PHONE_ERROR');
    }
    return student;
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    faculty: string,
    page: number,
  ): Promise<PaginatedResponse<Student>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();

    let query = {};

    if (searchString) {
      query = {
        $and: [
          {
            $or: [
              { ho_ten: { $regex: searchString, $options: 'i' } },
              { ma_so_sinh_vien: { $regex: searchString, $options: 'i' } },
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

    if (faculty) {
      query = {
        $and: [
          { khoa: faculty },
          query,
        ],
      };
    }

    let students: Student[] = [];
    try {
      students = await this.studentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.error('student.repository.findAll: Error finding students', error.stack);
      throw new BaseException(error, 'FIND_ALL_STUDENT_ERROR');
    }

    let total = 0;
    try {
      total = await this.studentModel.countDocuments({$or: [{ deleted_at: { $exists: false } }, { deleted_at: null }]}).exec();
    } catch (error) {
      this.logger.error('student.repository.findAll: Error counting students', error.stack);
      throw new BaseException(error, 'COUNT_STUDENTS_ERROR');
    }

    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<Student>(
      students,
      page,
      limit,
      total,
      totalPages,
    );
  }

  async findById(id: string): Promise<Student | null> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        this.logger.error(`student.repository.findById: Invalid ObjectId format for ID ${id}`);
        throw new StudentNotFoundException(id);
      }
      
      const student = await this.studentModel.findOne({ 
        _id: id, 
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] 
      }).exec();
      return student;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        throw error;
      }
      this.logger.error(`student.repository.findById: Error finding student with ID ${id}`, error.stack);
      throw new BaseException(error, 'FIND_STUDENT_BY_ID_ERROR');
    }
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student | null> {
    try {
      const filteredData: Partial<Student> = {};
      
      for (const key in studentData) {
        if (
          studentData[key] !== null && 
          studentData[key] !== undefined && 
          studentData[key] !== ''
        ) {
          filteredData[key] = studentData[key];
        }
      }
      
      if (Object.keys(filteredData).length === 0) {
        const student = await this.findById(id);
        if (!student) {
          throw new StudentNotFoundException(id);
        }
        return student;
      }
      
      const updatedStudent = await this.studentModel
      .findOneAndUpdate(
        {
          $and: [
            { _id: id },
            { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }
          ]
        },
        filteredData,
        { new: true }
      )
      .exec();
      
      if (!updatedStudent) {
        throw new StudentNotFoundException(id);
      }
      
      return updatedStudent;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        throw error;
      }
      this.logger.error(`student.repository.update: Error updating student with ID ${id}`, error.stack);
      throw new BaseException(error, 'UPDATE_STUDENT_ERROR');
    }
  }

  async softDelete(id: string): Promise<Student | null> {
    try {
      const deletedStudent = await this.studentModel
        .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
        .exec();

      if (!deletedStudent) {
        throw new StudentNotFoundException(id);
      }
      
      return deletedStudent;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        throw error;
      }
      this.logger.error(`student.repository.softDelete: Error deleting student with ID ${id}`, error.stack);
      throw new BaseException(error, 'DELETE_STUDENT_ERROR');
    }
  }

  async findByMSSV(mssv: string, excludeId?: string): Promise<Student | null> {
    try {
      const query: any = { 
        ma_so_sinh_vien: mssv,
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] 
      };
      
      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const student = await this.studentModel.findOne(query).exec();
      return student;
    } catch (error) {
      this.logger.error(`student.repository.findByMSSV: Error finding student with MSSV ${mssv}`, error.stack);
      throw new BaseException(error, 'FIND_STUDENT_BY_MSSV_ERROR');
    }
  }
}