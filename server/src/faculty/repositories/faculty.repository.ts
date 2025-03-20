import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faculty } from '../interfaces/faculty.interface';
import { IFacultyRepository } from './faculty.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { FacultyNotFoundException } from '../exceptions/faculty-not-found.exception';

@Injectable()
export class FacultyRepository implements IFacultyRepository {
  constructor(@InjectModel('Faculty') private facultyModel: Model<Faculty>) {}

  async create(facultyData: any): Promise<Faculty> {
    const faculty = new this.facultyModel(facultyData);
    let createdFaculty: Faculty | null = null;
    try {
      createdFaculty = await faculty.save();
    } catch (error) {
      throw new BaseException(error, 'CREATE_FACULTY_ERROR');
    }
    return createdFaculty;
  }

  async update(id: string, facultyData: Partial<Faculty>): Promise<Faculty | null> {
    try {
      const updatedFaculty = await this.facultyModel
        .findOneAndUpdate({
          _id: id,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }]
        }, facultyData, { new: true })
        .exec();
      
      if (!updatedFaculty) {
        throw new FacultyNotFoundException(id);
      }
      
      return updatedFaculty;
    } catch (error) {
      if (error instanceof FacultyNotFoundException) {
        throw error;
      }
      throw new BaseException(error, 'UPDATE_FACULTY_ERROR');
    }
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Faculty>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();

    let query = {};

    if (searchString) {
      query = {
        $or: [
          { name: { $regex: searchString, $options: 'i' } },
          { code: { $regex: searchString, $options: 'i' } },
          { deleted_at: { $exists: false } }, { deleted_at: null }
        ],
      };
    } else {
      query = { $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] };
    }
    let faculties: Faculty[] = [];
    try {
      faculties = await this.facultyModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      throw new BaseException(error, 'FIND_ALL_FACULTY_ERROR');
    }

    let total = 0;
    try {
      total = await this.facultyModel.countDocuments({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] });
    } catch (error) {
      throw new BaseException(error, 'COUNT_FACULTIES_ERROR');
    }
    
    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<Faculty>(
      faculties,
      page,
      limit,
      total,
      totalPages,
    );
  }

  async softDelete(id: string): Promise<Faculty | null> {
    try {
      const deletedFaculty = await this.facultyModel
        .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
        .exec();
      
      if (!deletedFaculty) {
        throw new FacultyNotFoundException(id);
      }
      
      return deletedFaculty;
    } catch (error) {
      if (error instanceof FacultyNotFoundException) {
        throw error;
      }
      throw new BaseException(error, 'DELETE_FACULTY_ERROR');
    }
  }

    async getAll(): Promise<Faculty[]> {
        let faculties: Faculty[] = [];
        try {
        faculties = await this.facultyModel.find({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
        } catch (error) {
        throw new BaseException(error, 'FIND_ALL_FACULTY_ERROR');
        }
        return faculties;
    }
}