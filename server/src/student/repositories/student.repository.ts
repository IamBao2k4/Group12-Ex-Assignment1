import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../interfaces/student.interface';
import { IStudentRepository } from './student.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(@InjectModel('Student') private studentModel: Model<Student>) {}

  async create(studentData: any): Promise<Student> {
    const student = new this.studentModel(studentData);
    let createdStudent: Student | null = null;
    try {
      createdStudent = await student.save();
    } catch (error) {
      throw new BaseException(error, 'CREATE_STUDENT_ERROR');
    }
    return createdStudent;
  }

  async findByEmailOrPhone(email: string, so_dien_thoai: string, excludeId?: string): Promise<Student | null> {
    const query: any = {
      $or: [{ email }, { so_dien_thoai }],
      deleted_at: { $exists: false }
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    let student: Student | null = null;
    try {
      student = await this.studentModel.findOne(query).exec();
    } catch (error) {
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
        ],
        deleted_at: { $exists: false },
      };
    } else {
      query = { deleted_at: { $exists: false } };
    }
    let students: Student[] = [];
    try {
      students = await this.studentModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new BaseException(error, 'FIND_ALL_STUDENT_ERROR');
    }

    const total = await this.studentModel.countDocuments({deleted_at: { $exists: false }});
    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<Student>(
      students,
      page,
      limit,
      total,
      totalPages,
    );
  }



  async update(id: string, studentData: Partial<Student>): Promise<Student | null> {
    return this.studentModel
      .findByIdAndUpdate(id, studentData, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<Student | null> {
    const date = new Date();
    try {
      return this.studentModel
        .findByIdAndUpdate(id, { deleted_at: date }, { new: true })
        .exec();
    } catch (error) {
      throw new BaseException(error, 'DELETE_STUDENT_ERROR');
    }
  }
}
