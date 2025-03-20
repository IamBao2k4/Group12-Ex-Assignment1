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
      this.logger.log(`Created student with ID: ${createdStudent._id}`);
    } catch (error) {
      this.logger.error('Error creating student', error.stack);
      throw new BaseException(error, 'CREATE_STUDENT_ERROR');
    }
    return createdStudent;
  }

  async findByEmailOrPhone(email: string, so_dien_thoai: string, excludeId?: string): Promise<Student | null> {
    const query: any = {
      $or: [
        { email }, 
        { so_dien_thoai },
        { deleted_at: { $exists: false } }, 
        { deleted_at: null }
      ]
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    let student: Student | null = null;
    try {
      student = await this.studentModel.findOne(query).exec();
      this.logger.log(`Found student by email or phone: ${student?._id}`);
    } catch (error) {
      this.logger.error('Error finding student by email or phone', error.stack);
      throw new BaseException(error, 'FIND_STUDENT_BY_EMAIL_OR_PHONE_ERROR');
    }
    return student;
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Student>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();

    let query = {};

    if (searchString) {
      query = {
        $or: [
          { ho_ten: { $regex: searchString, $options: 'i' } },
          { ma_so_sinh_vien: { $regex: searchString, $options: 'i' } },
          { deleted_at: { $exists: false } },
          { deleted_at: null }
        ],
      };
    } else {
      query = { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] };
    }
    let students: Student[] = [];
    try {
      students = await this.studentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
      this.logger.log(`Found ${students.length} students`);
    } catch (error) {
      this.logger.error('Error finding all students', error.stack);
      throw new BaseException(error, 'FIND_ALL_STUDENT_ERROR');
    }

    let total = 0;
    try {
      total = await this.studentModel.countDocuments({$or: [{ deleted_at: { $exists: false } }, { deleted_at: null }]}).exec();
      this.logger.log(`Total students count: ${total}`);
    } catch (error) {
      this.logger.error('Error counting students', error.stack);
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
      const student = await this.studentModel.findOne({ 
        _id: id, 
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] 
      }).exec();
      this.logger.log(`Found student by ID: ${student?._id}`);
      return student;
    } catch (error) {
      this.logger.error(`Error finding student by ID: ${id}`, error.stack);
      throw new BaseException(error, 'FIND_STUDENT_BY_ID_ERROR');
    }
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student | null> {
    try {
      const updatedStudent = await this.studentModel
      .findOneAndUpdate(
        {
          $and: [
            { _id: id },
            { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }
          ]
        },
        studentData,
        { new: true }
      )
      .exec();
      
      if (!updatedStudent) {
        this.logger.warn(`Student not found for update with ID: ${id}`);
        throw new StudentNotFoundException(id);
      }
      
      this.logger.log(`Updated student with ID: ${updatedStudent._id}`);
      return updatedStudent;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating student with ID: ${id}`, error.stack);
      throw new BaseException(error, 'UPDATE_STUDENT_ERROR');
    }
  }

  async softDelete(id: string): Promise<Student | null> {
    try {
      const deletedStudent = await this.studentModel
        .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
        .exec();
      
      if (!deletedStudent) {
        this.logger.warn(`Student not found for soft delete with ID: ${id}`);
        throw new StudentNotFoundException(id);
      }
      
      this.logger.log(`Soft deleted student with ID: ${deletedStudent._id}`);
      return deletedStudent;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        throw error;
      }
      this.logger.error(`Error soft deleting student with ID: ${id}`, error.stack);
      throw new BaseException(error, 'DELETE_STUDENT_ERROR');
    }
  }
}