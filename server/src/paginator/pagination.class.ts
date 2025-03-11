import { PaginationOptions } from './pagination.interface';

export class Pagination {
  private readonly page: number;
  private readonly limit: number;

  constructor(options: PaginationOptions) {
    this.page = options.page ?? 1;
    this.limit = options.limit ?? 10;
  }
  Skip(): number {
    return (this.page - 1) * this.limit;
  }

  Limit(): number {
    return this.limit;
  }

  Page(): number {
    return this.page;
  }
  TotalPages(totalRecords: number): number {
    return Math.ceil(totalRecords / this.limit);
  }
  
}
