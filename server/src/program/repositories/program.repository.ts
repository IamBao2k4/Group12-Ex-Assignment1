import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Program } from '../interfaces/program.interface';
import { IProgramRepository } from './program.repository.interface';
import { Pagination } from '../../common/paginator/pagination.class';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { BaseException } from 'src/common/exceptions/base.exception';
import { ProgramNotFoundException } from '../exceptions/program-not-found.exception';

@Injectable()
export class ProgramRepository implements IProgramRepository {
  private readonly logger = new Logger(ProgramRepository.name);

  constructor(@InjectModel('Program') private programModel: Model<Program>) {}

  async create(programData: any): Promise<Program> {
    const program = new this.programModel(programData);
    let createdProgram: Program | null = null;
    try {
      createdProgram = await program.save();
    } catch (error) {
      this.logger.error('program.repository.create: Error creating program', error.stack);
      throw new BaseException(error, 'CREATE_PROGRAM_ERROR');
    }
    return createdProgram;
  }

  async update(id: string, programData: Partial<Program>): Promise<Program | null> {
    try {
      const updatedProgram = await this.programModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }]
          },
          programData,
          { new: true }
        )
        .exec();
      
      if (!updatedProgram) {
        throw new ProgramNotFoundException(id);
      }
      
      return updatedProgram;
    } catch (error) {
      if (error instanceof ProgramNotFoundException) {
        throw error;
      }
      this.logger.error(`program.repository.update: Error updating program with ID ${id}`, error.stack);
      throw new BaseException(error, 'UPDATE_PROGRAM_ERROR');
    }
  }

  async findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Program>> {
    const pagination = new Pagination(paginationOpts);
    const skip = pagination.Skip();
    const limit = pagination.Limit();

    let query = {};

    if (searchString) {
      query = {
        $and: [
          {
            $or: [
              { name: { $regex: searchString, $options: 'i' } },
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
    let programs: Program[] = [];
    try {
      programs = await this.programModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      this.logger.error('program.repository.findAll: Error finding programs', error.stack);
      throw new BaseException(error, 'FIND_ALL_PROGRAM_ERROR');
    }

    let total = 0;
    try {
      total = await this.programModel.countDocuments({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] });
    } catch (error) {
      this.logger.error('program.repository.findAll: Error counting programs', error.stack);
      throw new BaseException(error, 'COUNT_PROGRAMS_ERROR');
    }
    
    const totalPages = pagination.TotalPages(total);

    return new PaginatedResponse<Program>(
      programs,
      page,
      limit,
      total,
      totalPages,
    );
  }

  async softDelete(id: string): Promise<Program | null> {
    try {
      const deletedProgram = await this.programModel
        .findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })
        .exec();
      
      if (!deletedProgram) {
        throw new ProgramNotFoundException(id);
      }
      
      return deletedProgram;
    } catch (error) {
      if (error instanceof ProgramNotFoundException) {
        throw error;
      }
      this.logger.error(`program.repository.softDelete: Error deleting program with ID ${id}`, error.stack);
      throw new BaseException(error, 'DELETE_PROGRAM_ERROR');
    }
  }

  async getAll(): Promise<Program[]> {
    let programs: Program[] = [];
    try {
      programs = await this.programModel.find({ $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error('program.repository.getAll: Error getting all programs', error.stack);
      throw new BaseException(error, 'GET_ALL_PROGRAMS_ERROR');
    }
    return programs;
  }

  async findByCode(code: string): Promise<Program | null> {
    try {
      return this.programModel.findOne({ ma: code, $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error(`program.repository.findByCode: Error finding program by code ${code}`, error.stack);
      throw new BaseException(error, 'FIND_PROGRAM_BY_CODE_ERROR');
    }
  }

  async detail(id: string): Promise<Program | null> {
    try {
      return this.programModel.findOne({ _id: id, $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }] }).exec();
    } catch (error) {
      this.logger.error(`program.repository.detail: Error finding program by id ${id}`, error.stack);
      throw new BaseException(error, 'FIND_PROGRAM_BY_ID_ERROR');
    }
  }
}