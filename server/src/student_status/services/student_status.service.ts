import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { StudentStatus } from '../interfaces/student_status.interface';
import { IStudentStatusRepository, STUDENT_STATUS_REPOSITORY } from '../repositories/student_status.repository.interface';
import { CreateStudentStatusDto, UpdateStudentStatusDto } from '../dtos/student_status.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

@Injectable()
export class StudentStatusService {
  constructor(
    @Inject(STUDENT_STATUS_REPOSITORY) private readonly studentStatusRepository: IStudentStatusRepository,
  ) { }

  async create(createReq: CreateStudentStatusDto): Promise<StudentStatus> {
    return this.studentStatusRepository.create(createReq);
  }

  async get(
    query: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<StudentStatus>> {
    return this.studentStatusRepository.findAll(query, searchString, page);
  }

  async update(id: string, updateReq: UpdateStudentStatusDto): Promise<StudentStatus | null> {
    return this.studentStatusRepository.update(id, updateReq);
  }

  async delete(id: string): Promise<StudentStatus | null> {
    return this.studentStatusRepository.softDelete(id);
  }

  async getAll(): Promise<StudentStatus[]> {
    return this.studentStatusRepository.getAll();
  }

  async getOne(id: string): Promise<StudentStatus> {
    return this.studentStatusRepository.getOne(id);
  }
}