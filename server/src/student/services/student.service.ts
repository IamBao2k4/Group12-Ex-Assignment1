import {
  HttpStatus,
  Injectable,
  NotFoundException,
  HttpException,
  Inject,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { Student } from '../interfaces/student.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { IStudentRepository, STUDENT_REPOSITORY } from '../repositories/student.repository.interface';
import { StudentNotFoundException, StudentExistsException } from '../exceptions';
import { ValidationError } from 'class-validator';
import { CreateStudentDto, UpdateStudentDto } from '../dtos/student.dto';
import { FacultyService } from '../../faculty/services/faculty.service';
import { ProgramService } from '../../program/services/program.service';
import { StudentStatusService } from '../../student_status/services/student_status.service';
import { STATUS_TRANSITIONS, STUDENT_STATUS } from '../../config/constants';
@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(forwardRef(() => FacultyService))
    private readonly facultyService: FacultyService,
    @Inject(forwardRef(() => ProgramService))
    private readonly programService: ProgramService,
    @Inject(forwardRef(() => StudentStatusService))
    private readonly studentStatusService: StudentStatusService
  ) { }

  async create(studentData: CreateStudentDto): Promise<Student> {
    try {
      const { email, so_dien_thoai, ma_so_sinh_vien, khoa, chuong_trinh, tinh_trang } = studentData;

      const existingStudentWithMSSV = await this.studentRepository.findByMSSV(ma_so_sinh_vien);
      
      if (existingStudentWithMSSV) {
        this.logger.error(`student.service.create: Student ID '${ma_so_sinh_vien}' already exists`);
        throw new BadRequestException(`Student ID '${ma_so_sinh_vien}' already exists`);
      }

      if (email && so_dien_thoai) {
        const existingStudent = await this.studentRepository.findByEmailOrPhone(email, so_dien_thoai);
        if (existingStudent) {
          this.logger.error(`student.service.create: Student with email '${email}' or phone number '${so_dien_thoai}' already exists`); 
          throw new StudentExistsException();
        }
      }

      if (khoa) {
        try {
          const faculty = await this.facultyService.detail(khoa.toString());
          if (!faculty) {
            this.logger.error(`student.service.create: Faculty with ID '${khoa}' does not exist`);
            throw new BadRequestException(`Faculty with ID '${khoa}' does not exist`);
          }
        } catch (error) {
          this.logger.error(`student.service.create: Faculty validation error: ${error.message}`);
          throw new BadRequestException(`Faculty validation error: ${error.message}`);
        }
      }

      if (chuong_trinh) {
        try {
          const program = await this.programService.detail(chuong_trinh.toString());
          if (!program) {
            this.logger.error(`student.service.create: Program with ID '${chuong_trinh}' does not exist`);
            throw new BadRequestException(`Program with ID '${chuong_trinh}' does not exist`);
          }
        } catch (error) {
          this.logger.error(`student.service.create: Program validation error: ${error.message}`);
          throw new BadRequestException(`Program validation error: ${error.message}`);
        }
      }

      if (tinh_trang) {
        try {
          const studentStatus = await this.studentStatusService.detail(tinh_trang);
          if (!studentStatus) {
            this.logger.error(`student.service.create: Student status with ID '${tinh_trang}' does not exist`);
            throw new BadRequestException(`Student status with ID '${tinh_trang}' does not exist`);
          }
        } catch (error) {
          this.logger.error(`student.service.create: Student status validation error: ${error.message}`);
          throw new BadRequestException(`Student status validation error: ${error.message}`);
        }
      }
      
      const createdStudent = await this.studentRepository.create(studentData as any);
      if (!createdStudent) {
        this.logger.error('student.service.create: Failed to create student');
        throw new InternalServerErrorException('Failed to create student');
      }
      return createdStudent;
    } catch (error) {
      this.handleServiceError(error, 'create', studentData);
    }
  }

  async get(
    paginationOpts: PaginationOptions,
    searchString: string,
    faculty: string,
    page: number,
  ): Promise<PaginatedResponse<Student>> {
    try {
      return await this.studentRepository.findAll(paginationOpts, searchString, faculty, page);
    } catch (error) {
      this.handleServiceError(error, 'get', { paginationOpts, searchString, faculty, page });
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
      this.handleServiceError(error, 'detail', { id });
    }
  }

  async update(id: string, studentData: Partial<Student>): Promise<Student> {
    try {
      const { ma_so_sinh_vien, khoa, chuong_trinh, tinh_trang } = studentData;
      
      const currentStudent = await this.studentRepository.findById(id);
      if (!currentStudent) {
        throw new StudentNotFoundException(id);
      }

      if (ma_so_sinh_vien) {
        const existingStudentWithMSSV = await this.studentRepository.findByMSSV(ma_so_sinh_vien, id);
        
        if (existingStudentWithMSSV) {
          throw new BadRequestException(`Student ID '${ma_so_sinh_vien}' already exists`);
        }
      }

      if (khoa) {
        try {
          const faculty = await this.facultyService.detail(khoa.toString());
          if (!faculty) {
            throw new BadRequestException(`Faculty with ID '${khoa}' does not exist`);
          }
        } catch (error) {
          throw new BadRequestException(`Faculty validation error: ${error.message}`);
        }
      }

      if (chuong_trinh) {
        try {
          const program = await this.programService.detail(chuong_trinh.toString());
          if (!program) {
            throw new BadRequestException(`Program with ID '${chuong_trinh}' does not exist`);
          }
        } catch (error) {
          throw new BadRequestException(`Program validation error: ${error.message}`);
        }
      }

      if (tinh_trang) {
        try {
          const statusBefore = currentStudent.tinh_trang ? currentStudent.tinh_trang.toString() : null;
          const statusCurrent = tinh_trang.toString();
          
          const studentStatus = await this.studentStatusService.detail(statusCurrent);
          if (!studentStatus) {
            throw new BadRequestException(`Student status with ID '${tinh_trang}' does not exist`);
          }
          
          if (statusBefore && !(await this.isValidStatusTransition(statusBefore, statusCurrent))) {
            throw new BadRequestException(`Invalid status transition from '${currentStudent.tinh_trang}' to '${tinh_trang}'`);
          }
        } catch (error) {
          throw new BadRequestException(`Student status validation error: ${error.message}`);
        }
      }

      const updatedStudent = await this.studentRepository.update(id, studentData as any);
      if (!updatedStudent) {
        throw new StudentNotFoundException(id);
      }
      return updatedStudent;
    } catch (error) {
      this.handleServiceError(error, 'update', { id, studentData });
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
      this.handleServiceError(error, 'delete', { id });
    }
  }

  private async isValidStatusTransition(currentStatusId: string, newStatusId: string): Promise<boolean> {
    try {
      const currentStatus = await this.studentStatusService.detail(currentStatusId);
      const newStatus = await this.studentStatusService.detail(newStatusId);
      
      if (!currentStatus || !newStatus) {
        return false;
      }
      
      const currentStatusName = currentStatus.tinh_trang;
      const newStatusName = newStatus.tinh_trang;
      
      if (!STATUS_TRANSITIONS[currentStatusName]) {
        return true;
      }
      
      return STATUS_TRANSITIONS[currentStatusName].includes(newStatusName);
    } catch (error) {
      this.logger.error(`Error checking status transition: ${error.message}`, error.stack);
      return false;
    }
  }

  private handleServiceError(error: any, operation: string, context?: any): never {
    const errorContext = {
      service: 'StudentService',
      operation,
      context: JSON.stringify(context),
    };

    if (error.name === 'ValidationError' || error.errors) {
      const validationErrors = this.formatValidationErrors(error);
      this.logger.error(
        `Validation error in ${operation}: ${JSON.stringify(validationErrors)}`,
        errorContext
      );
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    if (error instanceof StudentExistsException || error instanceof StudentNotFoundException) {
      this.logger.error(`${error.message}`, { ...errorContext, stack: error.stack });
      throw error;
    }

    if (error instanceof BadRequestException) {
      this.logger.error(`${error.message}`, { ...errorContext, stack: error.stack });
      throw error;
    }

    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      this.logger.error(
        `Database error in ${operation}: ${error.message}`,
        { ...errorContext, code: error.code, stack: error.stack }
      );
      throw new InternalServerErrorException('Database operation failed');
    }

    this.logger.error(
      `Unexpected error in ${operation}: ${error.message}`,
      { ...errorContext, stack: error.stack }
    );
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  private formatValidationErrors(error: any): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    if (Array.isArray(error.errors)) {
      error.errors.forEach((err: ValidationError) => {
        const constraints = err.constraints || {};
        formattedErrors[err.property] = Object.values(constraints);
      });
      return formattedErrors;
    }

    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        const err = error.errors[key];
        formattedErrors[key] = [err.message];
      });
      return formattedErrors;
    }

    return { general: [error.message || 'Unknown validation error'] };
  }
}
