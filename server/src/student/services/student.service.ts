import {
  HttpStatus,
  Injectable,
  NotFoundException,
  HttpException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Student } from '../interfaces/student.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { IStudentRepository, STUDENT_REPOSITORY } from '../repositories/student.repository.interface';
import { StudentNotFoundException, StudentExistsException } from '../exceptions';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository
  ) { }

  async create(studentData: any): Promise<Student> {
    try {
      const { email, so_dien_thoai } = studentData;

      const existingStudent = await this.studentRepository.findByEmailOrPhone(email, so_dien_thoai);

      if (existingStudent) {
        throw new StudentExistsException();
      }
      return this.studentRepository.create(studentData);
    } catch (error) {
      if (error instanceof StudentExistsException) {
        this.logger.error(`student.service.create: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async get(
    paginationOpts: PaginationOptions,
    searchString: string,
    faculty: string,
    page: number,
  ): Promise<PaginatedResponse<Student>> {
    try {
      return await this.studentRepository.findAll(paginationOpts, faculty, searchString, page);
    } catch (error) {
      this.logger.error(`student.service.get: ${error.message}`, error.stack);
      throw error;
    }
  }

  async detail(id: string): Promise<Student> {
    try {
      const student = await this.studentRepository.findById(id);
      if (!student) {
        throw new StudentNotFoundException(id);
      }
      return student;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        this.logger.error(`student.service.detail: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    try {
      const updatedStudent = await this.studentRepository.update(id, studentData);
      if (!updatedStudent) {
        throw new StudentNotFoundException(id);
      }
      return updatedStudent;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        this.logger.error(`student.service.update: ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<Student> {
    try {
      const deletedStudent = await this.studentRepository.softDelete(id);
      if (!deletedStudent) {
        throw new StudentNotFoundException(id);
      }
      return deletedStudent;
    } catch (error) {
      if (error instanceof StudentNotFoundException) {
        this.logger.error(`student.service.delete: ${error.message}`, error.stack);
      }
      throw error;
    }
  }
}
