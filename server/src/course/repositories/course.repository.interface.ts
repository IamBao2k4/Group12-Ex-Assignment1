import { Course } from '../interfaces/course.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const COURSE_REPOSITORY = 'COURSE_REPOSITORY';

export interface ICourseRepository {
    create(courseData: any): Promise<Course>;
    update(id: string, courseData: Partial<Course>): Promise<Course | null>;
    findAll(paginationOpts: PaginationOptions, searchString: string, page: number): Promise<PaginatedResponse<Course>>;
    softDelete(id: string): Promise<Course | null>;
    getAll(): Promise<Course[]>;
    findByCode(code: string): Promise<Course | null>;
    detail(id: string): Promise<Course | null>;
    getById(id: string): Promise<Course | null>;
}