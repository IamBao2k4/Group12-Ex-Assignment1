import { Document, ObjectId } from 'mongoose';

// danh sách lớp mở
export interface Grade extends Document {
  ma_lop: string;
  ma_mon_hoc: ObjectId;
  ma_hien_thi: string; // Mã hiển thị lớp học phần
  si_so: number; // Sĩ số lớp học phần
  nam_hoc: number;
  hoc_ky: number;
  giang_vien: string;
  so_luong_toi_da: number;
  lich_hoc: string;
  phong_hoc: string;
}
