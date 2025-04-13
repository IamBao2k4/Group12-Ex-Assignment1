export interface OpenClass {
  _id?: string;
  ma_lop: string;
  ma_mon_hoc: string;
  si_so: number;
  nam_hoc: number;
  hoc_ky: number;
  giang_vien: string;
  so_luong_toi_da: number;
  lich_hoc: string;
  phong_hoc: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface SearchOptions {
  nam_hoc?: number;
  hoc_ky?: number;
  keyword?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 