import { Grade } from '../interfaces/grade.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const GRADE_REPOSITORY = 'GRADE_REPOSITORY';

export interface IGradeRepository {
  create(gradeData: any): Promise<Grade>;
  update(id: string, gradeData: Partial<Grade>): Promise<Grade | null>;
  findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Grade>>;
  softDelete(id: string): Promise<Grade | null>;
  getAll(): Promise<Grade[]>;
  findByCode(code: string): Promise<Grade | null>;
  detail(id: string): Promise<Grade | null>;
  getById(id: string): Promise<Grade | null>;
}
