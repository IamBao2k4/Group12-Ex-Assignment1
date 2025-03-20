import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Faculty } from '../interfaces/faculty.interface';
import { IFacultyRepository, FACULTY_REPOSITORY } from '../repositories/faculty.repository.interface';
import { CreateFacultyDto, UpdateFacultyDto } from '../dtos/faculty.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

@Injectable()
export class FacultyService {
  constructor(
    @Inject(FACULTY_REPOSITORY) private readonly facultyRepository: IFacultyRepository,
  ) {}

  async create(createReq: CreateFacultyDto): Promise<Faculty> {
    return this.facultyRepository.create(createReq);
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Faculty>> {
    return this.facultyRepository.findAll(query, searchString, page);
  }

  async update(id: string, updateReq: UpdateFacultyDto): Promise<Faculty | null> {
    return this.facultyRepository.update(id, updateReq);
  }

  async delete(id: string): Promise<Faculty | null> {
    return this.facultyRepository.softDelete(id);
  }

    async getAll(): Promise<Faculty[]> {
        return this.facultyRepository.getAll();
    }
}