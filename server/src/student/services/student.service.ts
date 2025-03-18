import {
  HttpStatus,
  Injectable,
  NotFoundException,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Student } from '../interfaces/student.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { Logger } from '@nestjs/common';
import { IStudentRepository, STUDENT_REPOSITORY } from '../repositories/student.repository.interface';
import { StudentNotFoundException, StudentExistsException } from '../exceptions';

@Injectable()
export class StudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository
  ) {}

  async create(studentData: any): Promise<Student> {
    const { email, so_dien_thoai } = studentData;

    const existingStudent = await this.studentRepository.findByEmailOrPhone(email, so_dien_thoai);

    if (existingStudent) {
      throw new StudentExistsException();
    }

    return this.studentRepository.create(studentData);
  }

  async get(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Student>> {
    return this.studentRepository.findAll(paginationOpts, searchString, page);
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    const { email, so_dien_thoai } = studentData;
    
    if (email || so_dien_thoai) {
      const existingStudent = await this.studentRepository.findByEmailOrPhone(
        email || '', 
        so_dien_thoai || '', 
        id
      );

      if (existingStudent) {
        throw new StudentExistsException();
      }
    }

    const updatedStudent = await this.studentRepository.update(id, studentData);
    if (!updatedStudent) {
      throw new StudentNotFoundException(id);
    }
    return updatedStudent;
  }

  async delete(id: string): Promise<Student> {
    const deletedStudent = await this.studentRepository.softDelete(id);
    if (!deletedStudent) {
      throw new StudentNotFoundException(id);
    }
    return deletedStudent;
  }
}
