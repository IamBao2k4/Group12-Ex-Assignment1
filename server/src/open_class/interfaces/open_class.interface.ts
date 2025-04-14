import { Document, Types } from 'mongoose'; 
// danh sách lớp mở
export interface OpenClass extends Document {
  ma_lop: string;
  ma_mon_hoc: string;
  si_so: number; // Sĩ số lớp học phần
  nam_hoc: number;
  hoc_ky: number;
  giang_vien: string;
  so_luong_toi_da: number;
  lich_hoc: string;
  phong_hoc: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
