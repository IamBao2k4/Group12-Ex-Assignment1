import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './interfaces/student.interface';
import { Pagination } from '../paginator/pagination.class';
import { PaginationOptions } from '../paginator/pagination.interface';
import { PaginatedResponse } from '../paginator/pagination-response.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel('Student') private studentModel: Model<Student>) { }

  async create(studentData: any): Promise<Student> {
    const student = new this.studentModel(studentData);
    return student.save();
  }

  async get(paginationOpts: PaginationOptions, 
    searchString: string,
    page: number
  ): Promise<PaginatedResponse<Student>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();

    let query = {};

    if (searchString) {
      query = searchString
        ? {
          $or: [
            { ho_ten: { $regex: searchString, $options: 'i' } },
            { ma_so_sinh_vien: { $regex: searchString, $options: 'i' } }
          ]
        }
        : {};
    }

    const students = await this.studentModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.studentModel.countDocuments();
    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<Student>(
      students,
      page,
      limit,
      total,
      totalPages
    );
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    const updatedStudent = await this.studentModel.findByIdAndUpdate(id, studentData, { new: true }).exec();
    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  async delete(id: string): Promise<Student> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();
    if (!deletedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return deletedStudent;
  }
}
