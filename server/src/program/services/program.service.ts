import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Program } from '../interfaces/program.interface';
import { IProgramRepository, PROGRAM_REPOSITORY } from '../repositories/program.repository.interface';
import { CreateProgramDto, UpdateProgramDto } from '../dtos/program.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

@Injectable()
export class ProgramService {
  constructor(
    @Inject(PROGRAM_REPOSITORY) private readonly programRepository: IProgramRepository,
  ) {}

  async create(createReq: CreateProgramDto): Promise<Program> {
    return this.programRepository.create(createReq);
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Program>> {
    return this.programRepository.findAll(query, searchString, page);
  }

  async update(id: string, updateReq: UpdateProgramDto): Promise<Program | null> {
    return this.programRepository.update(id, updateReq);
  }

  async delete(id: string): Promise<Program | null> {
    return this.programRepository.softDelete(id);
  }
}