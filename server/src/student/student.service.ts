import {
  HttpStatus,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Student } from './interfaces/student.interface';
import { Pagination } from '../paginator/pagination.class';
import { PaginationOptions } from '../paginator/pagination.interface';
import { PaginatedResponse } from '../paginator/pagination-response.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel('Student') private studentModel: Model<Student>) {}

  async create(studentData: any): Promise<Student> {
    const { email, so_dien_thoai } = studentData;

    const existingStudent = await this.studentModel
      .findOne({ $or: [{ email }, { so_dien_thoai }] })
      .exec();

    if (existingStudent) {
      throw new HttpException(
        {
          message: 'Email hoặc số điện thoại đã tồn tại',
          errorCode: 'EMAIL_PHONE_EXISTS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const student = new this.studentModel(studentData);
    return student.save();
  }

  async get(
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

    const students = await this.studentModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

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

  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    const { email, so_dien_thoai } = studentData;
    const existingStudent = await this.studentModel
      .findOne({
        _id: { $ne: id },
        $or: [{ email }, { so_dien_thoai }],
      })
      .lean()
      .exec();

    if (existingStudent) {
      throw new HttpException(
        {
          message: 'Email hoặc số điện thoại đã tồn tại',
          errorCode: 'EMAIL_PHONE_EXISTS',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, studentData, { new: true })
      .exec();
    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  async delete(id: string): Promise<Student> {
    const date = new Date();
    const deletedStudent = await this.studentModel
      .findByIdAndUpdate(id, { deleted_at: date }, { new: true })
      .exec();
    if (!deletedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return deletedStudent;
  }
}
