import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(FacultyRepository.name);

  constructor(@InjectModel('Faculty') private facultyModel: Model<Faculty>) {}

  async create(facultyData: any): Promise<Faculty> {
    const faculty = new this.facultyModel(facultyData);
    let createdFaculty: Faculty | null = null;
    try {
      createdFaculty = await faculty.save();
      this.logger.log(`Created faculty with ID: ${createdFaculty._id}`);
    } catch (error) {
      this.logger.error('Error creating faculty', error.stack);
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
        this.logger.warn(`Faculty not found for update with ID: ${id}`);
        throw new FacultyNotFoundException(id);
      }
      
      this.logger.log(`Updated faculty with ID: ${updatedFaculty._id}`);
      return updatedFaculty;
    } catch (error) {
      if (error instanceof FacultyNotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating faculty with ID: ${id}`, error.stack);
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
        $and: [
          {
            $or: [
              { ten_khoa: { $regex: searchString, $options: 'i' } },
              { ma_khoa: { $regex: searchString, $options: 'i' } },
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
    let faculties: Faculty[] = [];
    try {
      faculties = await this.facultyModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
      this.logger.log(`Found ${faculties.length} faculties`);
    } catch (error) {
      this.logger.error('Error finding all faculties', error.stack);
      throw new BaseException(error, 'FIND_ALL_FACULTY_ERROR');
    }

    let total = 0;
    try {
      total = await this.facultyModel.countDocuments({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] });
      this.logger.log(`Total faculties count: ${total}`);
    } catch (error) {
      this.logger.error('Error counting faculties', error.stack);
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
        this.logger.warn(`Faculty not found for soft delete with ID: ${id}`);
        throw new FacultyNotFoundException(id);
      }
      
      this.logger.log(`Soft deleted faculty with ID: ${deletedFaculty._id}`);
      return deletedFaculty;
    } catch (error) {
      if (error instanceof FacultyNotFoundException) {
        throw error;
      }
      this.logger.error(`Error soft deleting faculty with ID: ${id}`, error.stack);
      throw new BaseException(error, 'DELETE_FACULTY_ERROR');
    }
  }

  async getAll(): Promise<Faculty[]> {
    let faculties: Faculty[] = [];
    try {
      faculties = await this.facultyModel.find({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
      this.logger.log(`Found ${faculties.length} faculties`);
    } catch (error) {
      this.logger.error('Error getting all faculties', error.stack);
      throw new BaseException(error, 'FIND_ALL_FACULTY_ERROR');
    }
    return faculties;
  }
}