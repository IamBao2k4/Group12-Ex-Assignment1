import { Student } from '../interfaces/student.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const STUDENT_REPOSITORY = 'STUDENT_REPOSITORY';

export interface IStudentRepository {
  create(studentData: any): Promise<Student>;
  findByEmailOrPhone(email: string, so_dien_thoai: string, excludeId?: string): Promise<Student | null>;
  findAll(paginationOpts: PaginationOptions, searchString: string, faculty: string, page: number): Promise<PaginatedResponse<Student>>;
  findById(id: string): Promise<Student | null>;
  update(id: string, studentData: Partial<Student>): Promise<Student | null>;
  softDelete(id: string): Promise<Student | null>;
  
  // Giữ lại chỉ phương thức liên quan đến domain Student
  findByMSSV(mssv: string, excludeId?: string): Promise<Student | null>;
}
