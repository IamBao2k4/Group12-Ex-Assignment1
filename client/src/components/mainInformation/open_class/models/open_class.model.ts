export interface OpenClass {
  _id?: string;
  ma_lop: string;
  ma_mon_hoc: CourseType,
  ten: string;
  si_so: number;
  nam_hoc: number;
  hoc_ky: number;
  giang_vien: string;
  so_luong_toi_da: number;
  lich_hoc: string;
  phong_hoc: string;
}

export interface CreateOpenClassDto {
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

export function ToCreateOpenClassDto(openClass: OpenClass): CreateOpenClassDto {
  return {
    ma_lop: openClass.ma_lop,
    ma_mon_hoc: openClass.ma_mon_hoc._id,
    si_so: openClass.si_so,
    nam_hoc: openClass.nam_hoc,
    hoc_ky: openClass.hoc_ky,
    giang_vien: openClass.giang_vien,
    so_luong_toi_da: openClass.so_luong_toi_da,
    lich_hoc: openClass.lich_hoc,
    phong_hoc: openClass.phong_hoc,
  };
}

export type CourseType = {
_id: string;
ma_mon_hoc: string;
ten: string;
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