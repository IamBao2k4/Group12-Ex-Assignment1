import { Program } from '../interfaces/program.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const PROGRAM_REPOSITORY = 'PROGRAM_REPOSITORY';

export interface IProgramRepository {
    create(programData: any): Promise<Program>;
    update(id: string, programData: Partial<Program>): Promise<Program | null>;
    findAll(paginationOpts: PaginationOptions, searchString: string, page: number): Promise<PaginatedResponse<Program>>;
    softDelete(id: string): Promise<Program | null>;
    getAll(): Promise<Program[]>;
}