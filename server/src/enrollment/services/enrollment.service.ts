import { Injectable, Inject, Logger } from '@nestjs/common';
import { Enrollment } from '../interfaces/enrollment.interface';
import { CreateEnrollmentDto } from '../dtos/enrollment.dto';
import { ENROLLMENT_REPOSITORY, IEnrollmentRepository } from '../repositories/enrollment.repository.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { 
  EnrollmentNotFoundException, 
  EnrollmentUpsertFailedException,
  EnrollmentValidationException 
} from '../exceptions';

@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger(EnrollmentService.name);

  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async get(paginationOptions: PaginationOptions): Promise<PaginatedResponse<Enrollment>> {
    try {
      return await this.enrollmentRepository.findAll(paginationOptions);
    } catch (error) {
      this.logger.error(`Error fetching enrollments: ${error.message}`, error.stack);
      throw error;
    }
  }

  async detail(id: string): Promise<Enrollment> {
    try {
      return await this.enrollmentRepository.findById(id);
    } catch (error) {
      this.logger.error(`Error fetching enrollment with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: string): Promise<Enrollment> {
    try {
      return await this.enrollmentRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting enrollment with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async upsert(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      this.validateEnrollmentData(createEnrollmentDto);
      return await this.enrollmentRepository.upsert(createEnrollmentDto);
    } catch (error) {
      this.logger.error(`Error upserting enrollment: ${error.message}`, error.stack);
      throw error;
    }
  }

  private validateEnrollmentData(data: CreateEnrollmentDto): void {
    const { ma_sv, ma_mon, ma_lop } = data;
    
    if (!ma_sv || !ma_sv.trim()) {
      throw new EnrollmentValidationException('Student ID (ma_sv) is required');
    }
    
    if (!ma_mon || !ma_mon.trim()) {
      throw new EnrollmentValidationException('Course ID (ma_mon) is required');
    }
    
    if (!ma_lop || !ma_lop.trim()) {
      throw new EnrollmentValidationException('Class ID (ma_lop) is required');
    }
  }

  async getByStudentId(studentId: string): Promise<Enrollment[]> {
    try {
      return await this.enrollmentRepository.findByStudentId(studentId);
    } catch (error) {
      this.logger.error(`Error fetching enrollments for student ID ${studentId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteByCourseId(course: string) {
    try {
      return await this.enrollmentRepository.deleteByCourseId(course);
    } catch (error) {
      this.logger.error(`Error deleting enrollments for course ID ${course}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 