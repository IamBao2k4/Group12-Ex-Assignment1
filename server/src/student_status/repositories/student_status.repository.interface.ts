import { StudentStatus } from '../interfaces/student_status.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const STUDENT_STATUS_REPOSITORY = 'STUDENT_STATUS_REPOSITORY';

export interface IStudentStatusRepository {
    create(studentStatusData: any): Promise<StudentStatus>;
    update(id: string, studentStatusData: Partial<StudentStatus>): Promise<StudentStatus | null>;
    findAll(paginationOpts: PaginationOptions, searchString: string, page: number): Promise<PaginatedResponse<StudentStatus>>;
    softDelete(id: string): Promise<StudentStatus | null>;
    getAll(): Promise<StudentStatus[]>;
    detail(id: string): Promise<StudentStatus>;
}