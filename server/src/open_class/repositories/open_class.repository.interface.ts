import { OpenClass } from '../interfaces/open_class.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';
import { SearchOptions } from '../dtos/search_options.dto';

export const OPEN_CLASS_REPOSITORY = 'OPEN_CLASS_REPOSITORY';

export interface IOpenClassRepository {
  create(gradeData: any): Promise<OpenClass>;
  update(id: string, gradeData: Partial<OpenClass>): Promise<OpenClass | null>;
  findAll(
    paginationOpts: PaginationOptions,
    searchString: SearchOptions,
  ): Promise<PaginatedResponse<OpenClass>>;
  softDelete(id: string): Promise<OpenClass | null>;
  getAll(): Promise<OpenClass[]>;
  findByCode(code: string): Promise<OpenClass | null>;
  detail(id: string): Promise<OpenClass | null>;
  getById(id: string): Promise<OpenClass | null>;
  getByStudentId(id: string): Promise<OpenClass[] | null>;
}
