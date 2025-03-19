import { Faculty } from '../interfaces/faculty.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const FACULTY_REPOSITORY = 'FACULTY_REPOSITORY';

export interface IFacultyRepository {
    create(facultyData: any): Promise<Faculty>;
    update(id: string, facultyData: Partial<Faculty>): Promise<Faculty | null>;
    findAll(paginationOpts: PaginationOptions, searchString: string, page: number): Promise<PaginatedResponse<Faculty>>;
    softDelete(id: string): Promise<Faculty | null>;
}
