import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grade } from '../interfaces/grade.interface';
import { IGradeRepository } from './grade.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { GradeNotFoundException } from '../exceptions/grade-not-found.exception';

@Injectable()
export class GradeRepository implements IGradeRepository {
  private readonly logger = new Logger(GradeRepository.name);

  constructor(@InjectModel('Grade') private gradeModel: Model<Grade>) {}

  async create(gradeData: any): Promise<Grade> {
    const grade = new this.gradeModel(gradeData);
    let createdGrade: Grade | null = null;
    try {
      createdGrade = await grade.save();
    } catch (error) {
      this.logger.error(
        'grade.repository.create: Error creating grade',
        error.stack,
      );
      throw new BaseException(error, 'CREATE_GRADE_ERROR');
    }
    return createdGrade;
  }

  async update(id: string, gradeData: Partial<Grade>): Promise<Grade | null> {
    try {
      const updatedGrade = await this.gradeModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
          },
          gradeData,
          { new: true },
        )
        .exec();

      if (!updatedGrade) {
        throw new GradeNotFoundException(id);
      }

      return updatedGrade;
    } catch (error) {
      if (error instanceof GradeNotFoundException) {
        throw error;
      }
      this.logger.error(
        `grade.repository.update: Error updating grade with ID ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'UPDATE_GRADE_ERROR');
    }
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Grade>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();

    let query = {};

    if (searchString) {
      query = {
        $and: [
          {
            $or: [{ ma_lop: { $regex: searchString, $options: 'i' } }],
          },
          {
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
          },
        ],
      };
    } else {
      query = {
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
      };
    }
    let grades: Grade[] = [];
    try {
      grades = await this.gradeModel.find(query).skip(skip).limit(limit).exec();
    } catch (error) {
      this.logger.error(
        'grade.repository.findAll: Error fetching grades',
        error.stack,
      );
      throw new BaseException(error, 'FIND_ALL_GRADES_ERROR');
    }

    let total = 0;
    try {
      total = await this.gradeModel.countDocuments({
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
      });
    } catch (error) {
      this.logger.error(
        'grade.repository.findAll: Error counting grades',
        error.stack,
      );
      throw new BaseException(error, 'COUNT_GRADES_ERROR');
    }

    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<Grade>(grades, page, limit, total, totalPages);
  }

  async softDelete(id: string): Promise<Grade | null> {
    try {
      const deletedGrade = await this.gradeModel.findByIdAndDelete(id).exec();

      if (!deletedGrade) {
        throw new GradeNotFoundException(id);
      }

      return deletedGrade;
    } catch (error) {
      if (error instanceof GradeNotFoundException) {
        throw error;
      }
      this.logger.error(
        `grade.repository.softDelete: Error deleting grade with ID ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'SOFT_DELETE_GRADE_ERROR');
    }
  }

  async getAll(): Promise<Grade[]> {
    let grades: Grade[] = [];
    try {
      grades = await this.gradeModel
        .find({ deleted_at: { $exists: false } })
        .exec();
    } catch (error) {
      this.logger.error(
        'grade.repository.getAll: Error fetching all grades',
        error.stack,
      );
      throw new BaseException(error, 'GET_ALL_GRADES_ERROR');
    }
    return grades;
  }

  async findByCode(code: string): Promise<Grade | null> {
    try {
      return this.gradeModel
        .findOne({
          ma_lop: code,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `grade.repository.findByCode: Error finding grade with code ${code}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_GRADE_BY_CODE_ERROR');
    }
  }

  async detail(id: string): Promise<Grade | null> {
    try {
      return this.gradeModel
        .findOne({
          _id: id,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `grade.repository.detail: Error finding grade by id ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_GRADE_BY_ID_ERROR');
    }
  }

  async getById(id: string): Promise<Grade | null> {
    try {
      return this.gradeModel
        .findOne({
          _id: id,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `grade.repository.getById: Error finding grade by id ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_GRADE_BY_ID_ERROR');
    }
  }
}
