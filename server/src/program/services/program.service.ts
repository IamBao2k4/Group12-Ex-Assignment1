import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Program } from '../interfaces/program.interface';
import { IProgramRepository, PROGRAM_REPOSITORY } from '../repositories/program.repository.interface';
import { CreateProgramDto, UpdateProgramDto } from '../dtos/program.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { ProgramNotFoundException } from '../exceptions/program-not-found.exception';
import { isValidObjectId } from '../../common/utils/validation.util';
@Injectable()
export class ProgramService {
  private readonly logger = new Logger(ProgramService.name);

  constructor(
    @Inject(PROGRAM_REPOSITORY) private readonly programRepository: IProgramRepository,
  ) {}

  async create(createReq: CreateProgramDto): Promise<Program> {
    try {
      return await this.programRepository.create(createReq);
    } catch (error) {
      this.logger.error(`program.service.create: ${error.message}`, error.stack);
      throw error;
    }
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Program>> {
    try {
      return await this.programRepository.findAll(query, searchString, page);
    } catch (error) {
      this.logger.error(`program.service.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateReq: UpdateProgramDto): Promise<Program | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`program.service.update: Invalid ObjectId format for ID ${id}`);
        throw new ProgramNotFoundException(id, true);
      }
      const result = await this.programRepository.update(id, updateReq);
      if (!result) {
        throw new ProgramNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof ProgramNotFoundException) {
        this.logger.error(`program.service.update: ${error.message}`, error.stack);
      } else {
        this.logger.error(`program.service.update: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Program | null> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`program.service.delete: Invalid ObjectId format for ID ${id}`);
        throw new ProgramNotFoundException(id, true);
      }
      const result = await this.programRepository.softDelete(id);
      if (!result) {
        throw new ProgramNotFoundException(id);
      }
      return result;
    } catch (error) {
      if (error instanceof ProgramNotFoundException) {
        this.logger.error(`program.service.delete: ${error.message}`, error.stack);
      } else {
        this.logger.error(`program.service.delete: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async getAll(): Promise<Program[]> {
    try {
      return await this.programRepository.getAll();
    } catch (error) {
      this.logger.error(`program.service.getAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCode(ma: string): Promise<Program | null> {
    try {
      return await this.programRepository.findByCode(ma);
    } catch (error) {
      this.logger.error(`program.service.findByCode: ${error.message}`, error.stack);
      throw error;
    }
  }

  async detail(id: string): Promise<Program> {
    try {
      if (!isValidObjectId(id)) {
        this.logger.error(`program.service.detail: Invalid ObjectId format for ID ${id}`);
        throw new ProgramNotFoundException(id, true);
      }
      const program = await this.programRepository.detail(id);
      if (!program) {
        throw new NotFoundException(`Program with ID ${id} not found`);
      }
      return program;
    } catch (error) {
      this.logger.error(`program.service.detail: ${error.message}`, error.stack);
      throw error;
    }
  }
}