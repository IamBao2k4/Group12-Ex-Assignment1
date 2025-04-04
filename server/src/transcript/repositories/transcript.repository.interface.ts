import { Transcript } from '../interfaces/transcript.interface';
import { PaginationOptions } from '../../common/paginator/pagination.interface';
import { PaginatedResponse } from '../../common/paginator/pagination-response.dto';

export const TRANSCRIPT_REPOSITORY = 'TRANSCRIPT_REPOSITORY';

export interface ITranscriptRepository {
  create(transcriptData: any): Promise<Transcript>;
  update(
    id: string,
    transcriptData: Partial<Transcript>,
  ): Promise<Transcript | null>;
  findAll(
    paginationOpts: PaginationOptions,
    searchString: string,
    page: number,
  ): Promise<PaginatedResponse<Transcript>>;
  softDelete(id: string): Promise<Transcript | null>;
  findByStudentId(studentId: string): Promise<Transcript[] | null>;
  findByCourseId(courseId: string): Promise<Transcript[] | null>;
}
