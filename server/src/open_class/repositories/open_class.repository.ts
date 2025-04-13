import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenClass } from '../interfaces/open_class.interface';
import { IOpenClassRepository } from './open_class.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { OpenClassNotFoundException } from '../exceptions/class-not-found.exception';
import { SearchOptions } from '../dtos/search_options.dto';
import { query } from 'express';
import { BuildQuery } from './utils';

@Injectable()
export class OpenClassRepository implements IOpenClassRepository {
  private readonly logger = new Logger(OpenClassRepository.name);

  constructor(@InjectModel('OpenClass') private OpenClassModel: Model<OpenClass>) {}

  async create(OpenClassData: any): Promise<OpenClass> {
    const OpenClass = new this.OpenClassModel(OpenClassData);
    let createdOpenClass: OpenClass | null = null;
    try {
      createdOpenClass = await OpenClass.save();
    } catch (error) {
      this.logger.error(
        'OpenClass.repository.create: Error creating OpenClass',
        error.stack,
      );
      throw new BaseException(error, 'CREATE_OpenClass_ERROR');
    }
    return createdOpenClass;
  }

  async update(id: string, OpenClassData: Partial<OpenClass>): Promise<OpenClass | null> {
    try {
      const updatedOpenClass = await this.OpenClassModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
          },
          OpenClassData,
          { new: true },
        )
        .exec();

      if (!updatedOpenClass) {
        throw new OpenClassNotFoundException(id);
      }

      return updatedOpenClass;
    } catch (error) {
      if (error instanceof OpenClassNotFoundException) {
        throw error;
      }
      this.logger.error(
        `OpenClass.repository.update: Error updating OpenClass with ID ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'UPDATE_OpenClass_ERROR');
    }
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: SearchOptions,
  ): Promise<PaginatedResponse<OpenClass>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();
    const page = pagination.Page();
    const query = BuildQuery(searchString);
    let OpenClasss: OpenClass[] = [];
    try {
      OpenClasss = await this.OpenClassModel.find(query).skip(skip).limit(limit).exec();
    } catch (error) {
      this.logger.error(
        'OpenClass.repository.findAll: Error fetching OpenClasss',
        error.stack,
      );
      throw new BaseException(error, 'FIND_ALL_OpenClassS_ERROR');
    }

    let total = 0;
    try {
      total = await this.OpenClassModel.countDocuments({
        $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
      });
    } catch (error) {
      this.logger.error(
        'OpenClass.repository.findAll: Error counting OpenClasss',
        error.stack,
      );
      throw new BaseException(error, 'COUNT_OpenClassS_ERROR');
    }

    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<OpenClass>(OpenClasss, page, limit, total, totalPages);
  }

  async softDelete(id: string): Promise<OpenClass | null> {
    try {
      const deletedOpenClass = await this.OpenClassModel.findByIdAndDelete(id).exec();

      if (!deletedOpenClass) {
        throw new OpenClassNotFoundException(id);
      }

      return deletedOpenClass;
    } catch (error) {
      if (error instanceof OpenClassNotFoundException) {
        throw error;
      }
      this.logger.error(
        `OpenClass.repository.softDelete: Error deleting OpenClass with ID ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'SOFT_DELETE_OpenClass_ERROR');
    }
  }

  async getAll(): Promise<OpenClass[]> {
    let OpenClasss: OpenClass[] = [];
    try {
      OpenClasss = await this.OpenClassModel
        .find({ deleted_at: { $exists: false } })
        .exec();
    } catch (error) {
      this.logger.error(
        'OpenClass.repository.getAll: Error fetching all OpenClasss',
        error.stack,
      );
      throw new BaseException(error, 'GET_ALL_OpenClassS_ERROR');
    }
    return OpenClasss;
  }

  async findByCode(code: string): Promise<OpenClass | null> {
    try {
      return this.OpenClassModel
        .findOne({
          ma_lop: code,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `OpenClass.repository.findByCode: Error finding OpenClass with code ${code}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_OpenClass_BY_CODE_ERROR');
    }
  }

  async detail(id: string): Promise<OpenClass | null> {
    try {
      return this.OpenClassModel
        .findOne({
          _id: id,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `OpenClass.repository.detail: Error finding OpenClass by id ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_OpenClass_BY_ID_ERROR');
    }
  }

  async getById(id: string): Promise<OpenClass | null> {
    try {
      return this.OpenClassModel
        .findOne({
          _id: id,
          $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }],
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `OpenClass.repository.getById: Error finding OpenClass by id ${id}`,
        error.stack,
      );
      throw new BaseException(error, 'FIND_OpenClass_BY_ID_ERROR');
    }
  }
}
