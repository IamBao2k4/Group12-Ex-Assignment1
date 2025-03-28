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

      await this.validateMSSVUnique(ma_so_sinh_vien);

      if (email && so_dien_thoai) {
        await this.validateEmailAndPhoneUnique(email, so_dien_thoai);
      }

      if (khoa) {
        await this.validateFacultyExists(khoa.toString());
      }

      if (chuong_trinh) {
        await this.validateProgramExists(chuong_trinh.toString());
      }

      if (tinh_trang) {
        await this.validateStudentStatusExists(tinh_trang);
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
        await this.validateMSSVUnique(ma_so_sinh_vien, id);
      }

      if (khoa) {
        await this.validateFacultyExists(khoa.toString());
      }

      if (chuong_trinh) {
        await this.validateProgramExists(chuong_trinh.toString());
      }

      if (tinh_trang) {
        await this.validateStudentStatusChange(currentStudent, tinh_trang.toString());
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


  private async validateMSSVUnique(mssv: string, excludeId?: string): Promise<void> {
    const existingStudentWithMSSV = await this.studentRepository.findByMSSV(mssv, excludeId);
    
    if (existingStudentWithMSSV) {
      this.logger.error(`student.service.validateMSSVUnique: Student ID '${mssv}' already exists`);
      throw new BadRequestException(`Student ID '${mssv}' already exists`);
    }
  }


  private async validateEmailAndPhoneUnique(email: string, phoneNumber: string): Promise<void> {
    const existingStudent = await this.studentRepository.findByEmailOrPhone(email, phoneNumber);
    if (existingStudent) {
      this.logger.error(`student.service.validateEmailAndPhoneUnique: Student with email '${email}' or phone number '${phoneNumber}' already exists`); 
      throw new StudentExistsException();
    }
  }


  private async validateFacultyExists(facultyId: string): Promise<void> {
    try {
      const faculty = await this.facultyService.detail(facultyId);
      if (!faculty) {
        this.logger.error(`student.service.validateFacultyExists: Faculty with ID '${facultyId}' does not exist`);
        throw new BadRequestException(`Faculty with ID '${facultyId}' does not exist`);
      }
    } catch (error) {
      this.logger.error(`student.service.validateFacultyExists: Faculty validation error: ${error.message}`);
      throw new BadRequestException(`Faculty validation error: ${error.message}`);
    }
  }


  private async validateProgramExists(programId: string): Promise<void> {
    try {
      const program = await this.programService.detail(programId);
      if (!program) {
        this.logger.error(`student.service.validateProgramExists: Program with ID '${programId}' does not exist`);
        throw new BadRequestException(`Program with ID '${programId}' does not exist`);
      }
    } catch (error) {
      this.logger.error(`student.service.validateProgramExists: Program validation error: ${error.message}`);
      throw new BadRequestException(`Program validation error: ${error.message}`);
    }
  }


  private async validateStudentStatusExists(statusId: string): Promise<void> {
    try {
      const studentStatus = await this.studentStatusService.detail(statusId);
      if (!studentStatus) {
        this.logger.error(`student.service.validateStudentStatusExists: Student status with ID '${statusId}' does not exist`);
        throw new BadRequestException(`Student status with ID '${statusId}' does not exist`);
      }
    } catch (error) {
      this.logger.error(`student.service.validateStudentStatusExists: Student status validation error: ${error.message}`);
      throw new BadRequestException(`Student status validation error: ${error.message}`);
    }
  }


  private async validateStudentStatusChange(currentStudent: Student, newStatusId: string): Promise<void> {
    try {
      await this.validateStudentStatusExists(newStatusId);
      
      const statusBefore = currentStudent.tinh_trang ? currentStudent.tinh_trang.toString() : null;
      
      if (statusBefore && !(await this.isValidStatusTransition(statusBefore, newStatusId))) {
        throw new BadRequestException(`Invalid status transition from '${currentStudent.tinh_trang}' to '${newStatusId}'`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Student status validation error: ${error.message}`);
    }
  }
}
