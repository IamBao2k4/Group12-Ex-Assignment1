import { Enrollment } from '../interfaces/enrollment.interface';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../dtos/enrollment.dto';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const ENROLLMENT_REPOSITORY = 'ENROLLMENT_REPOSITORY';

export interface IEnrollmentRepository {
  // Main method for enrollment management
  upsert(enrollment: CreateEnrollmentDto): Promise<Enrollment>;
  
  // Supporting methods
  findById(id: string): Promise<Enrollment>;
  findAll(options?: PaginationOptions): Promise<PaginatedResponse<Enrollment>>;
  delete(id: string): Promise<Enrollment>;
  
  // These methods are kept for potential future use but not currently needed
  create(enrollment: CreateEnrollmentDto): Promise<Enrollment>;
  update(id: string, enrollment: UpdateEnrollmentDto): Promise<Enrollment>;

  findByStudentId(studentId: string): Promise<Enrollment[]>;
} 