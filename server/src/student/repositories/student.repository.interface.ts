import { Student } from '../interfaces/student.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const STUDENT_REPOSITORY = 'STUDENT_REPOSITORY';

export interface IStudentRepository {
  create(studentData: any): Promise<Student>;
  findByEmailOrPhone(email: string, so_dien_thoai: string, excludeId?: string): Promise<Student | null>;
  findAll(paginationOpts: PaginationOptions,faculty: string, searchString: string, page: number): Promise<PaginatedResponse<Student>>;
  update(id: string, studentData: Partial<Student>): Promise<Student | null>;
  softDelete(id: string): Promise<Student | null>;
}
