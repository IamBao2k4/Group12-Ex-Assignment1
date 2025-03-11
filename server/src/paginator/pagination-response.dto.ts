export class PaginatedResponse<T> {
    data: T[]; 
    meta: {
      page: number;
      limit: number; 
      totalPages: number; 
      total: number;
    };
  
    constructor(data: T[], page: number, limit: number, totalPages: number,total: number, ) {
      this.data = data;
      this.meta = {page, limit , total, totalPages};
    }
  }
  